from typing import Dict, Any

def calculate_caffeine_limit(user_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Calculates a personalized daily caffeine limit and recommended cutoff time.
    This is a wellness-oriented calculation, not medical advice.
    """
    age = user_data.get("age", 25)
    weight = user_data.get("weight", 70) # in kg
    sensitivity = user_data.get("sensitivity", "medium")
    sleep_time = user_data.get("sleep_time", "22:00")
    
    # Base limit: 3mg per kg of body weight is a conservative starting point
    base_limit = weight * 3
    
    # Adjust for sensitivity
    if sensitivity == "high":
        base_limit *= 0.6
    elif sensitivity == "low":
        base_limit *= 1.2
        
    # Adjust for age
    if age < 18:
        base_limit = min(base_limit, 100)
    elif age > 65:
        base_limit *= 0.8
        
    # Cap at a safe maximum (400mg is the standard FDA safe limit for most adults)
    daily_limit = min(round(base_limit), 400)
    
    # Calculate recommended cutoff time (8-10 hours before sleep)
    # Simple logic for now: subtract 9 hours from sleep_time
    try:
        hour, minute = map(int, sleep_time.split(":"))
        cutoff_hour = (hour - 9) % 24
        cutoff_time = f"{cutoff_hour:02d}:{minute:02d}"
    except:
        cutoff_time = "14:00"
        
    return {
        "daily_limit_mg": daily_limit,
        "recommended_cutoff": cutoff_time,
        "sensitivity_level": sensitivity
    }
