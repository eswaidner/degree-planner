import json
from pathlib import Path


coursesFilePath = "../data/raw/courses.json"
classesOutputPath = "../data/classes.json"


def parseClass(c):
    # only include 4000 and below classes in data set
    if int(c["prefix"].split(" ")[1][0]) > 4: return None

    prereqs = None
    coreqs = None
    offered = "always"

    descEndIdx = len(c['description'])

    prerPrefix = "Prer., "
    prerStartIdx = c["description"].find(prerPrefix)
    if prerStartIdx > 0:
        start = prerStartIdx+len(prerPrefix)
        end = c["description"][start:].find(".") + start
        if end < start: end = len(c["description"])
        prereqs = c["description"][start:end]
        descEndIdx = prerStartIdx

    coreqPrefix = "Coreq., "
    coreqStartIdx = c["description"].find(coreqPrefix)
    if coreqStartIdx > 0:
        start = coreqStartIdx+len(coreqPrefix)
        end = c["description"][start:].find(".") + start
        if end < start: end = len(c["description"])
        coreqs = c["description"][start:end]
        descEndIdx = min(descEndIdx, coreqStartIdx)

    offeredPrefix = "Course typically offered: "
    offeredStartIdx = c["description"].find(offeredPrefix)
    if offeredStartIdx > 0:
        offeredStrs = c["description"][offeredStartIdx+len(offeredPrefix):].split()
        if offeredStrs[0].startswith("Alt"): offered = "unknown"
        elif offeredStrs[0] == "Rarely": offered = "rarely"
        elif len(offeredStrs) == 1: offered = offeredStrs[0].lower().strip(",")
        elif len(offeredStrs) > 3: offered = "unknown"

    return {
        "number": c["prefix"],
        "name": c["name"],
        "description": c["description"][:descEndIdx].strip(),
        "credits": c["credits"],
        "prereqs": prereqs,
        "coreqs": coreqs,
        "offered": offered,
    }


def processClasses():
    with open(coursesFilePath, 'r') as f:
        rawCourses = json.loads(f.read())

    classes = {}
    for c in rawCourses:
        cls = parseClass(c)
        if cls == None: continue
        classes[cls["number"]] = cls
    
    Path("../data").mkdir(parents=True, exist_ok=True)
    
    with open(classesOutputPath, 'w') as f:
        f.write(json.dumps(classes, indent=2))


processClasses()