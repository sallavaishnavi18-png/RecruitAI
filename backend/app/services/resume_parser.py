def parse_resume_text(text):
    candidate = {
        "name": "",
        "email": "",
        "phone": "",
        "skills": [],
        "education": [],
        "experience": [],
        "achievements": []
    }

    lines = text.split("\n")

    current_section = ""

    for line in lines:
        line = line.strip()

        if not line:
            continue

        # Basic personal details
        if not candidate["name"]:
            candidate["name"] = line

        if "@" in line:
            candidate["email"] = line

        if line.startswith("+"):
            candidate["phone"] = line

        # Detect resume sections
        if line.upper() == "SKILLS":
            current_section = "skills"
            continue

        elif line.upper() == "EDUCATION":
            current_section = "education"
            continue

        elif line.upper() == "EXPERIENCE":
            current_section = "experience"
            continue

        elif line.upper() == "ACHIEVEMENTS":
            current_section = "achievements"
            continue

        # Add information to the correct section
        if current_section == "skills":
            if line not in ["Design Tools", "Specialties", "Soft Skills"]:
                candidate["skills"].append(line)

        elif current_section == "education":
            candidate["education"].append(line)

        elif current_section == "experience":
            candidate["experience"].append(line)

        elif current_section == "achievements":
            candidate["achievements"].append(line)

    return candidate