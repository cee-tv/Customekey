import random
import string
import sys
import os
from datetime import datetime, timedelta

def generate_custom_key(duration_days=1):
    """Generate a key valid for the specified duration in days."""
    now = datetime.utcnow() + timedelta(hours=8)  # PH time (UTC+8)
    
    # Generate a random 12-character alphanumeric key
    chars = string.ascii_uppercase + string.digits
    key = ''.join(random.choices(chars, k=12))
    
    # Format the key with validity period
    start_date = now.strftime("%Y-%m-%d")
    expiry_date = (now + timedelta(days=duration_days)).strftime("%Y-%m-%d")
    
    key_content = f"KEY: {key}\nVALID FROM: {start_date}\nVALID UNTIL: {expiry_date}\nVALID FOR: {duration_days} day(s)\n\nPlease use this key within the validity period."
    
    # Use current date as the filename base
    filename = f"{start_date}_{duration_days}days.txt"
    
    with open(f"keys/{filename}", "w") as f:
        f.write(key_content)
    
    return key_content

if __name__ == "__main__":
    duration_value = int(sys.argv[1]) if len(sys.argv) > 1 else 1
    duration_unit = sys.argv[2] if len(sys.argv) > 2 else "days"
    
    # Convert all durations to days
    unit_multipliers = {
        "days": 1,
        "weeks": 7,
        "months": 30,
        "years": 365
    }
    
    if duration_unit not in unit_multipliers:
        print(f"Invalid duration unit: {duration_unit}. Using days.")
        duration_unit = "days"
    
    total_days = duration_value * unit_multipliers[duration_unit]
    
    # Ensure keys directory exists
    os.makedirs("keys", exist_ok=True)
    
    try:
        key = generate_custom_key(total_days)
        print(f"Generated key: {key}")
    except Exception as e:
        print(f"Error: {e}")
        exit(1)
