import os
import requests
import time
import random
import json
from bs4 import BeautifulSoup
from pathlib import Path
from rich.progress import Progress

catalogUrl = "https://catalog.uccs.edu/content.php?catoid=37&catoid=37&navoid=8467&filter[item_type]=3&filter[only_active]=1&filter[3]=1&filter[cpage]="
courseUrl = "https://catalog.uccs.edu/preview_course_nopop.php?catoid=37&coid="
catalogPageCount = 46 # as of October 13th, 2025

coidsFilePath = "../data/raw/course_coids.txt"
coursesFilePath = "../data/raw/courses.json"

def fetchCourseCoids():
    print("Fetching course URLs...")
    coids = []

    Path("../data/raw").mkdir(parents=True, exist_ok=True)

    with Progress() as progress:
        task = progress.add_task("Fetching...", total=catalogPageCount)

        for i in range(1, catalogPageCount+1):
            pageUrl = f'{catalogUrl}{i}'
            resp = requests.get(pageUrl)

            content = resp.text
            soup = BeautifulSoup(content, 'html.parser')

            courseAnchors = soup.select("a[href^='preview_course_nopop']")

            for a in courseAnchors:
                coids.append(a.get("href").split("=")[-1])

            progress.update(task, advance=1)

            # randomized delay between requests
            if i < catalogPageCount:
                time.sleep(random.randint(1, 3))

        with open(coidsFilePath, 'w') as f:
            f.write("\n".join(coids))


def fetchCourses():
    if not os.path.exists(coidsFilePath):
        print("ERROR: course coids file not found")
        return

    with open(coidsFilePath, 'r') as file:
        coids = file.read().splitlines()

    print(f"Fetching data for {len(coids)} courses...\n")

    courses = []

    with Progress() as progress:
        task = progress.add_task("Fetching...", total=len(coids))

        finishedCount = 0
        for coid in coids:
            try:
                content = requests.get(f'{courseUrl}{coid}').text
                soup = BeautifulSoup(content, 'html.parser')

                titleHeader = soup.select_one("#course_preview_title")
                titleElements = titleHeader.text.split("\xa0-\xa0")
                credits = titleHeader.next.next.text
                description = titleHeader.parent.select_one("hr").next.text

                course = {}
                course["prefix"] = titleElements[0]
                course["name"] = titleElements[1]
                course["credits"] = float(credits)
                course["description"] = description

                courses.append(course)

                print(f"[{finishedCount+1}] {course["prefix"]} - {course["name"]}")
            except:
                print(f"ERROR: failed to process course {finishedCount+1} (coid: {coid})")

            finishedCount += 1
            progress.update(task, advance=1)

            # randomized delay between requests
            if finishedCount < len(coids):
                time.sleep(random.randint(1, 3))

    with open(coursesFilePath, 'w') as f:
        f.write(json.dumps(courses, indent=2))


# only refetch course coids if not cached
if not os.path.exists(coidsFilePath):
    fetchCourseCoids()

fetchCourses()