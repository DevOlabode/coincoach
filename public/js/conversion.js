const currencies = [
  { code: "AED", name: "United Arab Emirates Dirham", flag: "🇦🇪" },
  { code: "AFN", name: "Afghan Afghani", flag: "🇦🇫" },
  { code: "ALL", name: "Albanian Lek", flag: "🇦🇱" },
  { code: "AMD", name: "Armenian Dram", flag: "🇦🇲" },
  { code: "ANG", name: "Netherlands Antillean Guilder", flag: "🇨🇼" },
  { code: "AOA", name: "Angolan Kwanza", flag: "🇦🇴" },
  { code: "ARS", name: "Argentine Peso", flag: "🇦🇷" },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "AWG", name: "Aruban Florin", flag: "🇦🇼" },
  { code: "AZN", name: "Azerbaijani Manat", flag: "🇦🇿" },

  { code: "BAM", name: "Bosnia-Herzegovina Convertible Mark", flag: "🇧🇦" },
  { code: "BBD", name: "Barbadian Dollar", flag: "🇧🇧" },
  { code: "BDT", name: "Bangladeshi Taka", flag: "🇧🇩" },
  { code: "BGN", name: "Bulgarian Lev", flag: "🇧🇬" },
  { code: "BHD", name: "Bahraini Dinar", flag: "🇧🇭" },
  { code: "BIF", name: "Burundian Franc", flag: "🇧🇮" },
  { code: "BMD", name: "Bermudan Dollar", flag: "🇧🇲" },
  { code: "BND", name: "Brunei Dollar", flag: "🇧🇳" },
  { code: "BOB", name: "Bolivian Boliviano", flag: "🇧🇴" },
  { code: "BRL", name: "Brazilian Real", flag: "🇧🇷" },
  { code: "BSD", name: "Bahamian Dollar", flag: "🇧🇸" },
  { code: "BTN", name: "Bhutanese Ngultrum", flag: "🇧🇹" },
  { code: "BWP", name: "Botswanan Pula", flag: "🇧🇼" },
  { code: "BYN", name: "Belarusian Ruble", flag: "🇧🇾" },
  { code: "BZD", name: "Belize Dollar", flag: "🇧🇿" },

  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦" },
  { code: "CDF", name: "Congolese Franc", flag: "🇨🇩" },
  { code: "CHF", name: "Swiss Franc", flag: "🇨🇭" },
  { code: "CLP", name: "Chilean Peso", flag: "🇨🇱" },
  { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳" },
  { code: "COP", name: "Colombian Peso", flag: "🇨🇴" },
  { code: "CRC", name: "Costa Rican Colón", flag: "🇨🇷" },
  { code: "CUP", name: "Cuban Peso", flag: "🇨🇺" },
  { code: "CVE", name: "Cape Verdean Escudo", flag: "🇨🇻" },
  { code: "CZK", name: "Czech Koruna", flag: "🇨🇿" },

  { code: "DJF", name: "Djiboutian Franc", flag: "🇩🇯" },
  { code: "DKK", name: "Danish Krone", flag: "🇩🇰" },
  { code: "DOP", name: "Dominican Peso", flag: "🇩🇴" },
  { code: "DZD", name: "Algerian Dinar", flag: "🇩🇿" },

  { code: "EGP", name: "Egyptian Pound", flag: "🇪🇬" },
  { code: "ERN", name: "Eritrean Nakfa", flag: "🇪🇷" },
  { code: "ETB", name: "Ethiopian Birr", flag: "🇪🇹" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },

  { code: "FJD", name: "Fijian Dollar", flag: "🇫🇯" },
  { code: "FKP", name: "Falkland Islands Pound", flag: "🇫🇰" },
  { code: "FOK", name: "Faroese Króna", flag: "🇫🇴" },

  { code: "GBP", name: "British Pound Sterling", flag: "🇬🇧" },
  { code: "GEL", name: "Georgian Lari", flag: "🇬🇪" },
  { code: "GGP", name: "Guernsey Pound", flag: "🇬🇬" },
  { code: "GHS", name: "Ghanaian Cedi", flag: "🇬🇭" },
  { code: "GIP", name: "Gibraltar Pound", flag: "🇬🇮" },
  { code: "GMD", name: "Gambian Dalasi", flag: "🇬🇲" },
  { code: "GNF", name: "Guinean Franc", flag: "🇬🇳" },
  { code: "GTQ", name: "Guatemalan Quetzal", flag: "🇬🇹" },
  { code: "GYD", name: "Guyanaese Dollar", flag: "🇬🇾" },

  { code: "HKD", name: "Hong Kong Dollar", flag: "🇭🇰" },
  { code: "HNL", name: "Honduran Lempira", flag: "🇭🇳" },
  { code: "HRK", name: "Croatian Kuna", flag: "🇭🇷" },
  { code: "HTG", name: "Haitian Gourde", flag: "🇭🇹" },
  { code: "HUF", name: "Hungarian Forint", flag: "🇭🇺" },

  { code: "IDR", name: "Indonesian Rupiah", flag: "🇮🇩" },
  { code: "ILS", name: "Israeli New Shekel", flag: "🇮🇱" },
  { code: "IMP", name: "Isle of Man Pound", flag: "🇮🇲" },
  { code: "INR", name: "Indian Rupee", flag: "🇮🇳" },
  { code: "IQD", name: "Iraqi Dinar", flag: "🇮🇶" },
  { code: "IRR", name: "Iranian Rial", flag: "🇮🇷" },
  { code: "ISK", name: "Icelandic Króna", flag: "🇮🇸" },

  { code: "JEP", name: "Jersey Pound", flag: "🇯🇪" },
  { code: "JMD", name: "Jamaican Dollar", flag: "🇯🇲" },
  { code: "JOD", name: "Jordanian Dinar", flag: "🇯🇴" },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },

  { code: "KES", name: "Kenyan Shilling", flag: "🇰🇪" },
  { code: "KRW", name: "South Korean Won", flag: "🇰🇷" },
  { code: "KWD", name: "Kuwaiti Dinar", flag: "🇰🇼" },
  { code: "KZT", name: "Kazakhstani Tenge", flag: "🇰🇿" },

  { code: "LBP", name: "Lebanese Pound", flag: "🇱🇧" },
  { code: "LKR", name: "Sri Lankan Rupee", flag: "🇱🇰" },
  { code: "LRD", name: "Liberian Dollar", flag: "🇱🇷" },
  { code: "LYD", name: "Libyan Dinar", flag: "🇱🇾" },

  { code: "MAD", name: "Moroccan Dirham", flag: "🇲🇦" },
  { code: "MXN", name: "Mexican Peso", flag: "🇲🇽" },
  { code: "MYR", name: "Malaysian Ringgit", flag: "🇲🇾" },

  { code: "NGN", name: "Nigerian Naira", flag: "🇳🇬" },
  { code: "NOK", name: "Norwegian Krone", flag: "🇳🇴" },
  { code: "NZD", name: "New Zealand Dollar", flag: "🇳🇿" },

  { code: "PHP", name: "Philippine Peso", flag: "🇵🇭" },
  { code: "PKR", name: "Pakistani Rupee", flag: "🇵🇰" },
  { code: "PLN", name: "Polish Zloty", flag: "🇵🇱" },

  { code: "QAR", name: "Qatari Rial", flag: "🇶🇦" },

  { code: "RON", name: "Romanian Leu", flag: "🇷🇴" },
  { code: "RUB", name: "Russian Ruble", flag: "🇷🇺" },

  { code: "SAR", name: "Saudi Riyal", flag: "🇸🇦" },
  { code: "SEK", name: "Swedish Krona", flag: "🇸🇪" },
  { code: "SGD", name: "Singapore Dollar", flag: "🇸🇬" },
  { code: "ZAR", name: "South African Rand", flag: "🇿🇦" },

  { code: "THB", name: "Thai Baht", flag: "🇹🇭" },
  { code: "TRY", name: "Turkish Lira", flag: "🇹🇷" },

  { code: "UAH", name: "Ukrainian Hryvnia", flag: "🇺🇦" },
  { code: "UGX", name: "Ugandan Shilling", flag: "🇺🇬" },
  { code: "USD", name: "United States Dollar", flag: "🇺🇸" },

  { code: "VND", name: "Vietnamese Dong", flag: "🇻🇳" },

  { code: "XAF", name: "Central African CFA Franc", flag: "🌍" },
  { code: "XOF", name: "West African CFA Franc", flag: "🌍" },
  { code: "XPF", name: "CFP Franc", flag: "🌍" },
  { code: "XDR", name: "IMF Special Drawing Rights", flag: "🇺🇳" },

  { code: "ZMW", name: "Zambian Kwacha", flag: "🇿🇲" },
  { code: "ZWL", name: "Zimbabwean Dollar", flag: "🇿🇼" }
];


  function setupDropdown(input, list, hiddenInput) {
    input.addEventListener("focus", () => renderList(""));
    input.addEventListener("input", () => renderList(input.value));

    function renderList(search) {
      list.innerHTML = "";
      list.style.display = "block";

      currencies
        .filter(c => c.code.toLowerCase().includes(search.toLowerCase()) ||
                     c.name.toLowerCase().includes(search.toLowerCase()))
        .forEach(c => {
          const div = document.createElement("div");
          div.className = "dropdown-item";

          // Create flag span
          const flagSpan = document.createElement("span");
          flagSpan.className = "flag";
          flagSpan.textContent = c.flag;

          // Create code span
          const codeSpan = document.createElement("span");
          codeSpan.className = "code";
          codeSpan.textContent = c.code;

          // Create name span
          const nameSpan = document.createElement("span");
          nameSpan.className = "name";
          nameSpan.textContent = c.name;

          // Append elements
          div.appendChild(flagSpan);
          div.appendChild(codeSpan);
          div.appendChild(nameSpan);

          div.onclick = () => {
            input.value = `${c.code} — ${c.name}`;
            hiddenInput.value = c.code;
            list.style.display = "none";
          };
          list.appendChild(div);
        });
    }

    document.addEventListener("click", e => {
      if (!input.contains(e.target)) list.style.display = "none";
    });
  }

  const fromInput = document.getElementById("fromInput");
  const toInput = document.getElementById("toInput");
  const fromList = document.getElementById("fromList");
  const toList = document.getElementById("toList");

  setupDropdown(fromInput, fromList, document.querySelector("[name='fromCurrency']"));
  setupDropdown(toInput, toList, document.querySelector("[name='toCurrency']"));

  // Swap button functionality
  const swapButton = document.getElementById("swapButton");
  swapButton.addEventListener("click", () => {
    // Swap input values
    const tempValue = fromInput.value;
    fromInput.value = toInput.value;
    toInput.value = tempValue;

    // Swap hidden input values
    const fromHidden = document.querySelector("[name='fromCurrency']");
    const toHidden = document.querySelector("[name='toCurrency']");
    const tempHidden = fromHidden.value;
    fromHidden.value = toHidden.value;
    toHidden.value = tempHidden;

    // Add swap animation
    swapButton.style.transform = "rotate(180deg)";
    setTimeout(() => {
      swapButton.style.transform = "rotate(0deg)";
    }, 300);
  });

  const form = document.getElementById("converterForm");

  form.addEventListener("submit", async e => {
    e.preventDefault();

    try {
      // Show loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;

      const data = {
        amount: form.amount.value,
        fromCurrency: form.fromCurrency.value,
        toCurrency: form.toCurrency.value
      };

      // Validate inputs
      if (!data.amount || !data.fromCurrency || !data.toCurrency) {
        throw new Error("Please fill in all fields");
      }

      const res = await fetch("/conversion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Conversion failed");
      }

      // Format numbers for better display
      const formattedAmount = parseFloat(data.amount).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

      const formattedResult = parseFloat(result.convertedAmount).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

      const formattedRate = parseFloat(result.rate).toLocaleString(undefined, {
        minimumFractionDigits: 4,
        maximumFractionDigits: 6
      });

      // Update result display
      const resultBox = document.getElementById("resultBox");
      resultBox.style.display = "block";

      // Add animation if not already visible
      if (resultBox.style.opacity !== "1") {
        resultBox.style.opacity = "0";
        resultBox.style.transform = "translateY(10px)";
        setTimeout(() => {
          resultBox.style.transition = "all 0.3s ease-out";
          resultBox.style.opacity = "1";
          resultBox.style.transform = "translateY(0)";
        }, 10);
      }

      document.getElementById("convertedAmount").textContent =
        `${formattedAmount} ${data.fromCurrency} = ${formattedResult} ${data.toCurrency}`;
      document.getElementById("exchangeRate").textContent =
        `Exchange Rate: 1 ${data.fromCurrency} = ${formattedRate} ${data.toCurrency}`;

    } catch (error) {
      // Handle errors
      console.error("Conversion error:", error);

      // Show error message
      const resultBox = document.getElementById("resultBox");
      resultBox.style.display = "block";
      resultBox.style.borderLeft = "4px solid var(--danger)";
      resultBox.classList.add("bg-danger", "bg-opacity-10");

      document.getElementById("convertedAmount").innerHTML =
        `<i class="fas fa-exclamation-circle text-danger me-2"></i> Error`;
      document.getElementById("exchangeRate").textContent =
        error.message || "Something went wrong. Please try again.";
    } finally {
      // Restore button state
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
    }
  });
