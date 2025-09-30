import { useEffect, useState } from "react";
import { FaEdit, FaSave, FaSearch, FaTrash } from "react-icons/fa";
import CountryService, { CountryConfig } from "../../services/CountryService";
import toastHelper from "../../utils/toastHelper";

function CountryConfigPage() {
  const [countries, setCountries] = useState<CountryConfig[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<CountryConfig | null>(
    null
  );
  const [formData, setFormData] = useState<CountryConfig>({
    _id: "",
    code: "",
    country: "",
    flag: "",
    currencySign: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isFlagPickerOpen, setIsFlagPickerOpen] = useState(false);
  const [flagQuery, setFlagQuery] = useState("");

  const fetchCountries = async (search = "") => {
    setLoading(true);
    try {
      const response = await CountryService.getCountries({ search });
      if (response) setCountries(response);
    } catch (error) {
      console.error("Error fetching countries:", error);
      toastHelper.error("Failed to fetch countries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries(searchTerm);
  }, [searchTerm]);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveCountry = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await CountryService.saveCountry(formData);
      if (response) {
        setFormData({ _id: "", code: "", country: "", flag: "", currencySign: "" });
        toastHelper.showTost("Country saved successfully!", "success");
        setSelectedCountry(null);
        fetchCountries(searchTerm);
      }
    } catch (error) {
      console.error("Error saving country:", error);
      toastHelper.error("Failed to save country");
    }
  };

  const handleEditCountry = (country: CountryConfig) => {
    setSelectedCountry(country);
    setFormData({
      _id: country._id || "",
      code: country.code,
      country: country.country,
      flag: country.flag,
      currencySign: country.currencySign,
    });
  };

  const commonFlagEmojis = [
    // India
    { code: "+91", emoji: "🇮🇳", country: "India", currency: "INR", currencySign: "₹" },

    // US based countries
    { code: "+1", emoji: "🇺🇸", country: "United States", currency: "USD", currencySign: "$" },
    { code: "+1", emoji: "🇨🇦", country: "Canada", currency: "CAD", currencySign: "$" },

    // Additional North American countries
    { code: "+52", emoji: "🇲🇽", country: "Mexico", currency: "MXN", currencySign: "$" },
    { code: "+1", emoji: "🇯🇲", country: "Jamaica", currency: "JMD", currencySign: "J$" },

    // African based countries
    { code: "+234", emoji: "🇳🇬", country: "Nigeria", currency: "NGN", currencySign: "₦" },
    { code: "+27", emoji: "🇿🇦", country: "South Africa", currency: "ZAR", currencySign: "R" },
    { code: "+20", emoji: "🇪🇬", country: "Egypt", currency: "EGP", currencySign: "E£" },
    { code: "+254", emoji: "🇰🇪", country: "Kenya", currency: "KES", currencySign: "KSh" },
    { code: "+233", emoji: "🇬🇭", country: "Ghana", currency: "GHS", currencySign: "GH₵" },
    { code: "+212", emoji: "🇲🇦", country: "Morocco", currency: "MAD", currencySign: "DH" },
    { code: "+251", emoji: "🇪🇹", country: "Ethiopia", currency: "ETB", currencySign: "Br" },
    { code: "+255", emoji: "🇹🇿", country: "Tanzania", currency: "TZS", currencySign: "TSh" },

    // Additional popular countries
    { code: "+44", emoji: "🇬🇧", country: "United Kingdom", currency: "GBP", currencySign: "£" },
    { code: "+61", emoji: "🇦🇺", country: "Australia", currency: "AUD", currencySign: "$" },
    { code: "+49", emoji: "🇩🇪", country: "Germany", currency: "EUR", currencySign: "€" },
    { code: "+33", emoji: "🇫🇷", country: "France", currency: "EUR", currencySign: "€" },
    { code: "+81", emoji: "🇯🇵", country: "Japan", currency: "JPY", currencySign: "¥" },
    { code: "+86", emoji: "🇨🇳", country: "China", currency: "CNY", currencySign: "¥" },
    { code: "+55", emoji: "🇧🇷", country: "Brazil", currency: "BRL", currencySign: "R$" },
    { code: "+7", emoji: "🇷🇺", country: "Russia", currency: "RUB", currencySign: "₽" },
    { code: "+82", emoji: "🇰🇷", country: "South Korea", currency: "KRW", currencySign: "₩" },
    { code: "+39", emoji: "🇮🇹", country: "Italy", currency: "EUR", currencySign: "€" },
    { code: "+34", emoji: "🇪🇸", country: "Spain", currency: "EUR", currencySign: "€" },
  ];

  const filteredFlags = commonFlagEmojis.filter((f) => {
    const q = flagQuery.trim().toLowerCase();
    if (!q) return true;
    return f.country.toLowerCase().includes(q) || f.code.toLowerCase().includes(q);
  });

  const handleDeleteCountry = async (code: string) => {
    try {
      if (countries.length == 1) {
        toastHelper.showTost("Atleast one country is mandatory to run app.", "warning");
        return;
      }
      const response = await CountryService.deleteCountry(code);
      if (response) {
        toastHelper.showTost("Country deleted successfully!", "success");
        fetchCountries(searchTerm);
      }
    } catch (error) {
      console.error("Error deleting country:", error);
      toastHelper.error("Failed to delete country");
    }
  };

  return (
    <div className="p-6 flex flex-col lg:flex-row gap-6">
      {/* Left: Form */}
      <div className="lg:w-1/3 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
          {selectedCountry ? "Edit Country" : "Add / Edit Country"}
        </h2>
        <form onSubmit={handleSaveCountry}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Dial Code
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="e.g. +91, +1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Country
            </label>
            {/* <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="e.g. India"
              required
            /> */}
            <div className="relative mt-2">
              <button
                type="button"
                onClick={() => setIsFlagPickerOpen((v) => !v)}
                className="inline-flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-white/[0.03]"
              >
                <span className="text-base">{formData.flag || "🌎"}</span>
                <span>Select country</span>
                <span className="text-xs text-gray-400">{formData.code || ""}</span>
              </button>

              {isFlagPickerOpen && (
                <div className="absolute z-10 mt-2 w-full max-h-72 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-xl dark:bg-gray-900 dark:border-gray-800">
                  <div className="p-2 border-b border-gray-200 dark:border-gray-800">
                    <input
                      type="text"
                      autoFocus
                      value={flagQuery}
                      onChange={(e) => setFlagQuery(e.target.value)}
                      placeholder="Search country or dial code..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                    {filteredFlags.length === 0 ? (
                      <li className="px-3 py-3 text-sm text-gray-500 dark:text-gray-400">No matches</li>
                    ) : (
                      filteredFlags.map((f) => (
                        <li key={`${f.country}-${f.code}`}>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, flag: f.emoji, code: f.code, country: f.country, currencySign: f.currencySign });
                              setIsFlagPickerOpen(false);
                              setFlagQuery("");
                            }}
                            className="w-full px-3 py-2 flex items-center gap-3 text-left hover:bg-gray-50 dark:hover:bg-white/[0.03]"
                          >
                            <span className="text-xl">{f.emoji}</span>
                            <span className="text-sm text-gray-800 dark:text-white/90 flex-1">{f.country}</span>
                            <span className="text-xs text-gray-500">{f.code}</span>
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Flag
            </label>
            <input
              type="text"
              name="flag"
              value={formData.flag}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="e.g. emoji 🇮🇳"
              required
            />

          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Currency Sign
            </label>
            <input
              type="text"
              name="currencySign"
              value={formData.currencySign}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="e.g. ₹, $"
              maxLength={5}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            <FaSave />
            Save Country
          </button>
        </form>
      </div>

      {/* Right: Table */}
      <div className="lg:w-2/3 bg-white h-fit dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 rounded-lg">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                Countries ({countries.length})
              </h2>
            </div>
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search countries by code or name..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="max-w-full overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Code
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Country
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Flag
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Currency
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center">
                    <div className="text-gray-400 text-lg">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      Loading countries...
                    </div>
                  </td>
                </tr>
              ) : countries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center">
                    <div className="text-gray-400 text-lg">No countries found</div>
                  </td>
                </tr>
              ) : (
                countries.map((c) => (
                  <tr key={c._id || c.code} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-white/90 font-medium">
                      {c.code}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {c.country}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {c.flag}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {c.currencySign}
                    </td>
                    <td className="px-4 py-3 w-24">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditCountry(c)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors duration-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20 dark:hover:bg-blue-500/20"
                          title="Edit Country"
                        >
                          <FaEdit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteCountry(c.code)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors duration-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 dark:hover:bg-red-500/20"
                          title="Delete Country"
                        >
                          <FaTrash className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CountryConfigPage;


