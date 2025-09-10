import { useState, useMemo, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaPaperPlane,
} from "react-icons/fa";
import Swal from "sweetalert2";
import MessageTemplateService, {
  MessageTemplate,
  MessageTemplateListPayload,
  MessageTemplatePayload,
} from "../../services/TemplateServices";
import toastHelper from "../../utils/toastHelper";

interface SortConfig {
  key: keyof MessageTemplate | null;
  direction: "ascending" | "descending";
}

const Template = () => {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "ascending",
  });
  const [selectedTemplate, setSelectedTemplate] =
    useState<MessageTemplate | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const itemsPerPage = 10;

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const payload: MessageTemplateListPayload = {
        search: searchTerm,
        page: currentPage,
        limit: itemsPerPage,
      };
      const response = await MessageTemplateService.getMessageTemplates(
        payload
      );
      
      // Check the response structure
      if (response && response.status === 200) {
        setTemplates(response.data.docs);
        setTotalDocs(response.data.totalDocs);
        setTotalPages(response.data.totalPages);
      } else {
        const errorMessage = response?.message || "Unable to retrieve template list. Please try again.";
        toastHelper.showTost(errorMessage, "error");
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
      toastHelper.showTost(
        "An error occurred while fetching templates. Please try again later.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [currentPage, searchTerm]);

  const handleSort = (key: keyof MessageTemplate) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof MessageTemplate) => {
    if (sortConfig.key !== key)
      return <FaSort className="ml-1 text-gray-400" />;
    if (sortConfig.direction === "ascending")
      return <FaSortUp className="ml-1 text-gray-600" />;
    return <FaSortDown className="ml-1 text-gray-600" />;
  };

  const sortedTemplates = useMemo(() => {
    let sorted = [...templates];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof MessageTemplate];
        const bValue = b[sortConfig.key as keyof MessageTemplate];

        if (aValue === undefined && bValue === undefined) return 0;
        if (aValue === undefined)
          return sortConfig.direction === "ascending" ? 1 : -1;
        if (bValue === undefined)
          return sortConfig.direction === "ascending" ? -1 : 1;

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === "ascending" 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sorted;
  }, [templates, sortConfig]);

  const handleSaveTemplate = async (templateData: MessageTemplate) => {
    setIsSaving(true);
    try {
      const payload: MessageTemplatePayload = {
        _id: templateData._id,
        name: templateData.name,
        message: templateData.message,
        isActive: templateData.isActive,
      };
      
      const response = await MessageTemplateService.saveMessageTemplate(
        payload
      );
      
      if (response && response.status === 200) {
        await fetchTemplates();
        setSelectedTemplate(null);
        toastHelper.showTost(response.message || "Template saved successfully!", "success");
      } else {
        const errorMessage = response?.message || "Failed to save template. Please try again.";
        toastHelper.showTost(errorMessage, "error");
      }
    } catch (error) {
      console.error("Error saving template:", error);
      toastHelper.showTost(
        "An error occurred while saving the template. Please try again later.",
        "error"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "No, cancel!",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirmed.isConfirmed) return;

    try {
      const response = await MessageTemplateService.deleteMessageTemplate(
        templateId
      );
      
      if (response && response.status === 200) {
        await fetchTemplates();
        setSelectedTemplate(null);
        toastHelper.showTost(response.message || "Template deleted successfully!", "success");
      } else {
        const errorMessage = response?.message || "Failed to delete template. Please try again.";
        toastHelper.showTost(errorMessage, "error");
      }
    } catch (error) {
      console.error("Error deleting template:", error);
      toastHelper.showTost(
        "An error occurred while deleting the template. Please try again later.",
        "error"
      );
    }
  };

  const handleEditTemplate = (template: MessageTemplate) => {
    setSelectedTemplate(template);
  };

  const handleAddTemplate = () => {
    setSelectedTemplate({
      name: "",
      message: "",
      isActive: true
    });
  };

  const truncateMessage = (message: string, limit: number = 50) => {
    if (!message) return "";

    if (message.length > limit) {
      return message.substring(0, limit) + " ...";
    }

    return message;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Template Management
        </h1>
        <p className="text-gray-500 text-sm dark:text-gray-400 mt-1">
          Manage your notification templates
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/3 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 rounded-lg p-6 h-[500px] overflow-y-auto">
          <TemplateForm
            template={selectedTemplate}
            onSave={handleSaveTemplate}
            onCancel={() => setSelectedTemplate(null)}
            isLoading={isSaving}
          />
        </div>

        <div className="w-full lg:w-2/3">
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 dark:border-gray-800">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search templates by name..."
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <button
                onClick={handleAddTemplate}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.03]"
              >
                <FaPlus className="text-xs" />
                Add Template
              </button>
            </div>

            <div className="max-w-full overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-100 dark:border-gray-800">
                  <tr>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center">
                        Template Name
                        {getSortIcon("name")}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                      Message
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="p-12 text-center">
                        <div className="text-gray-400 text-lg">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                          Loading templates...
                        </div>
                      </td>
                    </tr>
                  ) : sortedTemplates.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-12 text-center">
                        <div className="text-gray-400 text-lg">
                          <FaPaperPlane className="mx-auto text-4xl mb-4" />
                          No templates found matching your criteria
                        </div>
                      </td>
                    </tr>
                  ) : (
                    sortedTemplates.map((template) => (
                      <tr
                        key={template._id}
                        className={`hover:bg-gray-50 dark:hover:bg-white/[0.02] ${
                          selectedTemplate?._id === template._id
                            ? "bg-blue-50 dark:bg-blue-500/10"
                            : ""
                        }`}
                        onClick={() => handleEditTemplate(template)}
                      >
                        <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-white/90">
                          {template.name}
                        </td>
                        <td
                          className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 max-w-xs overflow-hidden"
                          title={template.message}
                        >
                          {truncateMessage(template.message, 50)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            template.isActive 
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          }`}>
                            {template.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditTemplate(template);
                              }}
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded"
                              title="Edit"
                            >
                              <FaEdit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTemplate(template._id!);
                              }}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded"
                              title="Delete"
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

            <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-800">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
                Showing {sortedTemplates.length} of {totalDocs} templates
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.03] disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-sm"
                >
                  Previous
                </button>
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum =
                      totalPages <= 5
                        ? i + 1
                        : currentPage <= 3
                        ? i + 1
                        : currentPage >= totalPages - 2
                        ? totalPages - 4 + i
                        : currentPage - 2 + i;
                    if (pageNum > totalPages) return null;
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
      </div>
    </div>
  );
};

const TemplateForm = ({
  template,
  onSave,
  onCancel,
  isLoading,
}: {
  template: MessageTemplate | null;
  onSave: (templateData: MessageTemplate) => void;
  onCancel: () => void;
  isLoading: boolean;
}) => {
  const [name, setName] = useState(template?.name || "");
  const [message, setMessage] = useState(template?.message || "");
  const [isActive, setIsActive] = useState(template?.isActive ?? true);

  const extractVariables = (text: string): string[] => {
    const regex = /\{(\w+)\}/g;
    const matches = [...text.matchAll(regex)];
    return [...new Set(matches.map((match) => match[1]))];
  };

  useEffect(() => {
    setName(template?.name || "");
    setMessage(template?.message || "");
    setIsActive(template?.isActive ?? true);
  }, [template]);

  const handleAddVariable = () => {
    const existingVars = extractVariables(message);
    let newVarIndex = existingVars.length + 1;
    let newVariable = `var${newVarIndex}`;

    while (existingVars.includes(newVariable)) {
      newVarIndex++;
      newVariable = `var${newVarIndex}`;
    }

    setMessage((prev) => `${prev} {${newVariable}}`);
  };

  const handleSubmit = async () => {
    if (!name || !message) {
      Swal.fire("Error", "Name and message are required", "error");
      return;
    }
    
    try {
      await onSave({
        _id: template?._id,
        name,
        message,
        isActive,
      });
      
      // Only clear the form if we're creating a new template
      if (!template?._id) {
        setName("");
        setMessage("");
        setIsActive(true);
      }
    } catch (error) {
      // Error handling is managed in the parent component
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
        {template?._id ? "Edit Template" : "Create Template"}
      </h2>
      <div className="space-y-4 flex-grow">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Template Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Message
            </label>
            <button
              onClick={handleAddVariable}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.03]"
            >
              <FaPlus className="text-xs" />
              Add Var
            </button>
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={5}
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Active
          </label>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default Template;