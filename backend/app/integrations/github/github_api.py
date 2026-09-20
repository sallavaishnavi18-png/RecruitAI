import requests


def get_github_profile(username):

    url = f"https://api.github.com/users/{username}"

    response = requests.get(url)

    if response.status_code == 404:
        raise ValueError("GitHub user not found.")

    if response.status_code != 200:
        raise ValueError("Unable to fetch GitHub profile.")

    profile = response.json()

    return {
        "username": profile.get("login"),
        "name": profile.get("name"),
        "bio": profile.get("bio"),
        "public_repositories": profile.get("public_repos"),
        "followers": profile.get("followers"),
        "following": profile.get("following"),
        "profile_url": profile.get("html_url")
    }


def get_github_repositories(username):

    url = f"https://api.github.com/users/{username}/repos"

    response = requests.get(url)

    if response.status_code != 200:
        raise ValueError("Unable to fetch GitHub repositories.")

    repositories = response.json()

    repo_data = []

    for repo in repositories:

        repo_data.append({
            "name": repo.get("name"),
            "description": repo.get("description"),
            "language": repo.get("language"),
            "stars": repo.get("stargazers_count"),
            "forks": repo.get("forks_count"),
            "url": repo.get("html_url")
        })

    return repo_data


def analyze_github_profile(username):

    profile = get_github_profile(username)

    repositories = get_github_repositories(username)

    return {
        "profile": profile,
        "repositories": repositories
    }