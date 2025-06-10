#!/bin/bash

# Required keys
keys=(
"achievementFilterReset"
"achievements.category.bronze"
"achievements.category.diamond"
"achievements.category.gold"
"achievements.category.platinum"
"achievements.category.silver"
"achievements.category.time"
"achievements.filter.all"
"achievements.filter.all_categories"
"achievements.filter.announcement.changed"
"achievements.filter.announcement.no_results"
"achievements.filter.announcement.reset"
"achievements.filter.announcement.results"
"achievements.filter.available_shortcuts"
"achievements.filter.category"
"achievements.filter.count.all"
"achievements.filter.count.category_all"
"achievements.filter.count.generic"
"achievements.filter.focus_category"
"achievements.filter.focus_status"
"achievements.filter.keyboard_shortcuts"
"achievements.filter.reset"
"achievements.filter.reset_aria"
"achievements.filter.reset_filters"
"achievements.filter.status"
"achievements.filter.title"
"achievements.filter.toggle_keyboard_help"
"achievements.status.in_progress"
"achievements.status.locked"
"achievements.status.unlocked"
)

for locale in src/i18n/locales/*.ts; do
  locale_name=$(basename "$locale" .ts)
  echo "🌍 $locale_name:"
  
  missing=0
  for key in "${keys[@]}"; do
    escaped_key=$(echo "$key" | sed 's/\./\\./g')
    if ! grep -q "\"$escaped_key\":" "$locale" && ! grep -q "'$escaped_key':" "$locale"; then
      if [ $missing -eq 0 ]; then
        echo "  ❌ Fehlende Keys:"
      fi
      echo "    - $key"
      ((missing++))
    fi
  done
  
  if [ $missing -eq 0 ]; then
    echo "  ✅ Alle Keys vorhanden"
  fi
  echo ""
done
