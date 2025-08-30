import { useState, useEffect } from "react";
import {
  FaSearch,
  FaSave,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import CategoryService, { Category, CategoryPayload } from "../../services/CategoryService";
import toastHelper from "../../utils/toastHelper";

interface CategoryListPayload {
  docs: Category[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<Category>({
    _id: "",
    name: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  // Fetch categories
  const fetchCategories = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const response = await CategoryService.getCategories({
        search,
        page,
        limit: itemsPerPage,
      });
      if (response) {
        setCategories(response.docs);
        setTotalPages(response.totalPages);
        setTotalDocs(response.totalDocs);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toastHelper.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  // Handle form input changes
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await CategoryService.saveCategory(formData);
      if (response) {
        toastHelper.showTost(response.message || 'Category saved successfully!', 'success');
        setFormData({
          _id: "",
          name: "",
        });
        setSelectedCategory(null);
        fetchCategories(currentPage, searchTerm);
      }
    } catch (error) {
      console.error("Error saving category:", error);
      toastHelper.error("Failed to save category");
    }
  };

  // Handle edit category
  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      _id: category._id || "",
      name: category.name,
    });
  };

  // Handle delete category
  const handleDeleteCategory = async (id: string) => {
    try {
      const response = await CategoryService.deleteCategory(id);
      if (response) {
        toastHelper.showTost(response.message || 'Category deleted successfully!', 'success');
        fetchCategories(currentPage, searchTerm);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toastHelper.error("Failed to delete category");
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-6 flex flex-col lg:flex-row gap-6">
      {/* Left Side: Category Form */}
      <div className="lg:w-1/3 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 rounded-lg p-6 h-fit">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
          {selectedCategory ? "Edit Category" : "Create Category"}
        </h2>
        <form onSubmit={handleSaveCategory}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Enter category name"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
            <FaSave />
            Save Category
          </button>
        </form>
      </div>

      {/* Right Side: Table */}
      <div className="lg:w-2/3 bg-white h-fit dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 rounded-lg">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                Categories
              </h2>
            </div>
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories by name..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </div>

        <div className="max-w-full overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Created At
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={3} className="p-12 text-center">
                    <div className="text-gray-400 text-lg">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      Loading categories...
                    </div>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-12 text-center">
                    <div className="text-gray-400 text-lg">
                      No categories found matching your criteria
                    </div>
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr
                    key={category._id}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-white/90">
                      {category.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(category.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category._id!)}
                          className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-800">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
            Showing {categories.length} of {totalDocs} categories
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.03] disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-sm"
            >
              Previous
            </button>
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      currentPage === pageNum
                        ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20"
                        : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.03]"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.03] disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-sm"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Categories;