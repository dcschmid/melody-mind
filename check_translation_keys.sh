#!/bin/bash

echo "�� Überprüfe Translation-Keys in allen Locales..."
echo ""

# Keys die in AchievementFilter.astro verwendet werden
check_key() {
    local key="$1"
    local file="$2"
    grep -q "\"$key\":" "$file"
}

# Alle Locale-Dateien
for locale in src/i18n/locales/*.ts; do
    locale_name=$(basename "$locale" .ts)
    echo "🌍 $locale_name:"
    
    missing=0
    
    # Teste einige wichtige Keys
    keys=(
        "achievements.filter.title"
        "achievements.filter.status" 
        "achievements.filter.category"
        "achievements.filter.all"
        "achievements.filter.reset"
        "achievements.status.unlocked"
        "achievements.status.locked"
        "achievements.status.in_progress"
        "achievements.category.bronze"
        "achievements.category.silver"
        "achievements.category.gold"
        "achievements.filter.announcement.changed"
        "achievements.filter.count.generic"
    )
    
    for key in "${keys[@]}"; do
        if ! check_key "$key" "$locale"; then
            if [ $missing -eq 0 ]; then
                echo "  ❌ Fehlende Keys:"
            fi
            echo "    - $key"
            ((missing++))
        fi
    done
    
    if [ $missing -eq 0 ]; then
        echo "  ✅ Wichtige Keys vorhanden"
    else
        echo "  ❌ $missing Keys fehlen"
    fi
    
    echo ""
done
