#!/bin/bash
# Fetch clean official payment logos from Wikimedia Commons
OUT=/home/z/my-project/public/images/pay
fetch () {
  local name="$1"; shift
  for f in "$@"; do
    url="https://commons.wikimedia.org/wiki/Special:FilePath/${f}?width=512"
    tmp=$(mktemp --suffix=.img)
    code=$(curl -sL -o "$tmp" -w "%{http_code}" --max-time 40 -A "Mozilla/5.0 (compatible; AssetFetcher/1.0)" "$url")
    kind=$(file -b --mime-type "$tmp" 2>/dev/null)
    size=$(stat -c%s "$tmp" 2>/dev/null || echo 0)
    if [ "$code" = "200" ] && [[ "$kind" == image/* ]] && [ "$size" -gt 3000 ]; then
      ext="png"; [[ "$kind" == image/jpeg ]] && ext="jpg"
      mv "$tmp" "$OUT/${name}.${ext}"
      echo "OK  $name <- $f ($kind, ${size}B)"
      return 0
    fi
    rm -f "$tmp"
  done
  echo "MISS $name"
}

fetch mastercard "Mastercard-logo.svg" "MasterCard_logo.svg" "Mastercard_logo.svg"
fetch rupay "RuPay_Logo.svg" "RuPay_logo.svg" "RuPay.svg" "RuPay_-_Logo.svg"
fetch upi "UPI-Logo.png" "Unified_Payments_Interface_logo.png" "UPI_logo.png" "Logo_of_Unified_Payments_Interface.png"
fetch paytm "Paytm_logo.svg" "Paytm_Logo.svg" "Paytm.svg"
fetch gpay "Google_Pay_Logo.svg" "Google_Pay_(GPay)_Logo.svg" "Google_Pay.svg" "GPay_Logo.svg"
echo done
