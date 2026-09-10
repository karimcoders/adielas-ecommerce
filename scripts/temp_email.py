#!/usr/bin/env python3
"""Create a temp email via mail.tm and save credentials to /home/z/my-project/.temp_email.json"""
import json, random, string, time, urllib.request

API = "https://api.mail.tm"

def req(method, path, body=None, token=None):
    data = json.dumps(body).encode() if body is not None else None
    r = urllib.request.Request(API + path, data=data, method=method)
    r.add_header("Content-Type", "application/json")
    if token:
        r.add_header("Authorization", f"Bearer {token}")
    with urllib.request.urlopen(r, timeout=30) as resp:
        return json.loads(resp.read().decode())

# 1. available domains
domains = req("GET", "/domains")["hydra:member"]
dom = domains[0]["domain"]

# 2. random address + password
user = "adielas" + "".join(random.choices(string.ascii_lowercase + string.digits, k=8))
address = f"{user}@{dom}"
password = "Adielas#" + "".join(random.choices(string.ascii_letters + string.digits, k=12))

# 3. create account
req("POST", "/accounts", {"address": address, "password": password})
time.sleep(1)

# 4. get JWT
tok = req("POST", "/token", {"address": address, "password": password})

creds = {"address": address, "password": password, "token": tok["token"], "id": tok["id"]}
with open("/home/z/my-project/.temp_email.json", "w") as f:
    json.dump(creds, f, indent=2)

print("EMAIL:", address)
print("PASSWORD:", password)
print("OK - saved to .temp_email.json")
