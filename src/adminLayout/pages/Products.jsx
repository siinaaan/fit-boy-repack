import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminProducts,
  addAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
} from "../features/adminProductSlice";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  LoaderCircle,
} from "lucide-react";

const emptyForm = {
  title: "",
  price: "",
  category: "Action",
  platform: "PC",
  image: ["", "", ""],
  description: "",
};

const PAGE_SIZE = 5;

function Products() {
  const dispatch = useDispatch();

  const {
    products = [],
    loading,
    error,
  } = useSelector((state) => state.adminProducts);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    return products.filter((product) =>
      [product.title, product.category, product.platform]
        .some((value) =>
          String(value || "").toLowerCase().includes(term)
        )
    );
  }, [products, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const openAddModal = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);

    setForm({
      title: product.title || "",
      price: String(product.price ?? ""),
      category: product.category || "Action",
      platform: product.platform || "PC",
      image: [
        product.image?.[0] || "",
        product.image?.[1] || "",
        product.image?.[2] || "",
      ],
      description: product.description || "",
    });

    setFormError("");
    setIsModalOpen(true);
  };

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const updateImage = (index, value) => {
    setForm((previous) => ({
      ...previous,
      image: previous.image.map((url, i) =>
        i === index ? value : url
      ),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    const title = form.title.trim();
    const price = Number(form.price);

    if (!title || !form.category || !form.platform) {
      setFormError("Please fill in all required fields.");
      return;
    }

    if (form.price.trim() === "" || !Number.isFinite(price) || price < 0) {
      setFormError("Enter a valid price.");
      return;
    }

    if (!form.image[0].trim()) {
      setFormError("Please provide the main game image URL.");
      return;
    }

    const productData = {
      title,
      price,
      category: form.category,
      platform: form.platform,
      image: form.image.map((url) => url.trim()).filter(Boolean),
      description: form.description.trim(),
    };

    setSaving(true);

    try {
      if (editingProduct) {
        await dispatch(
          updateAdminProduct({
            id: editingProduct.id,
            productData,
          })
        ).unwrap();
      } else {
        await dispatch(addAdminProduct(productData)).unwrap();
        setPage(1);
      }

      setIsModalOpen(false);
      setEditingProduct(null);
      setForm(emptyForm);
   } catch (err) {
  console.error("Save game error:", err);

  const message =
    typeof err === "string"
      ? err
      : err?.message ||
        err?.error ||
        JSON.stringify(err) ||
        "Unable to save the game.";

  setFormError(message);
} finally {
  setSaving(false);
}
  };

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Delete "${product.title}"? This will remove it from your games collection.`
    );

    if (!confirmed) return;

    setDeletingId(product.id);

    try {
      await dispatch(deleteAdminProduct(product.id)).unwrap();
    } catch {
      window.alert("Unable to delete the game. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1F51FF] drop-shadow-[0_0_8px_rgba(31,81,225,0.5)]">
            Product Management
          </h1>
          <p className="mt-2 text-zinc-400">
            Manage your FitBoy Repacks game collection.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-lg bg-[#1F51FF] px-4 py-3 font-medium transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-zinc-900 px-4">
        <Search size={19} className="text-zinc-500" />
        <input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Search games, categories, platforms..."
          className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-zinc-500"
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-white/10 bg-zinc-900/70">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-white/10 bg-white/5 text-zinc-400">
              <tr>
                <th className="px-5 py-4">Product</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Platform</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {loading && products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-zinc-400">
                    <LoaderCircle className="mx-auto mb-3 animate-spin" />
                    Loading products...
                  </td>
                </tr>
              ) : paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-zinc-400">
                    <Gamepad2 size={32} className="mx-auto mb-3 opacity-50" />
                    No products found.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="transition hover:bg-white/[0.03]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image?.[0]}
                          alt={product.title}
                          className="h-14 w-11 rounded-md object-cover"
                        />
                        <div>
                          <p className="font-medium text-white">
                            {product.title}
                          </p>
                          <p className="mt-1 text-xs text-zinc-500">
                            ID: {product.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-zinc-300">
                      {product.category}
                    </td>

                    <td className="px-5 py-4 text-zinc-300">
                      {product.platform}
                    </td>

                    <td className="px-5 py-4 font-medium text-emerald-400">
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          title="Edit product"
                          className="rounded-lg border border-blue-500/20 p-2 text-blue-400 transition hover:bg-blue-500/10"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(product)}
                          disabled={deletingId === product.id}
                          title="Delete product"
                          className="rounded-lg border border-red-500/20 p-2 text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                        >
                          {deletingId === product.id ? (
                            <LoaderCircle size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-5 py-4">
          <p className="text-sm text-zinc-400">
            {filteredProducts.length === 0
              ? "0 products"
              : `${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(
                  currentPage * PAGE_SIZE,
                  filteredProducts.length
                )} of ${filteredProducts.length} products`}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((previous) => Math.max(1, previous - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-white/10 p-2 disabled:opacity-30"
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="min-w-20 text-center text-sm text-zinc-300">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() =>
                setPage((previous) => Math.min(totalPages, previous + 1))
              }
              disabled={currentPage >= totalPages}
              className="rounded-lg border border-white/10 p-2 disabled:opacity-30"
              aria-label="Next page"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-2 text-zinc-400 hover:bg-white/10 hover:text-white"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-zinc-300">
                  Game Title *
                </label>
                <input
                  required
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="Enter game title"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-zinc-300">
                    Price (₹) *
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="1"
                    value={form.price}
                    onChange={(event) => updateField("price", event.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 outline-none focus:border-blue-500"
                    placeholder="3799"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-zinc-300">
                    Platform *
                  </label>
                  <input
                    required
                    value={form.platform}
                    onChange={(event) => updateField("platform", event.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 outline-none focus:border-blue-500"
                    placeholder="PC"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-300">
                  Category *
                </label>
                <select
                  required
                  value={form.category}
                  onChange={(event) => updateField("category", event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 outline-none focus:border-blue-500"
                >
                  {[
                    "Action",
                    "Action Adventure",
                    "Action RPG",
                    "Adventure",
                    "Horror",
                    "Open world",
                    "Racing",
                    "RPG",
                    "Shooter",
                    "Sports",
                  ].map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {form.image.map((url, index) => (
                <div key={index}>
                  <label className="mb-2 block text-sm text-zinc-300">
                    Image URL {index + 1} {index === 0 ? "*" : "(optional)"}
                  </label>
                  <input
                    required={index === 0}
                    type="url"
                    value={url}
                    onChange={(event) => updateImage(index, event.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 outline-none focus:border-blue-500"
                    placeholder="https://example.com/game-image.jpg"
                  />
                </div>
              ))}

              <div>
                <label className="mb-2 block text-sm text-zinc-300">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(event) => updateField("description", event.target.value)}
                  className="w-full resize-y rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="Describe the game..."
                />
              </div>

              {formError && (
                <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
                  {formError}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-white/10 px-4 py-3 text-zinc-300 hover:bg-white/5"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-[#1F51FF] px-5 py-3 font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving && <LoaderCircle size={16} className="animate-spin" />}
                  {saving
                    ? "Saving..."
                    : editingProduct
                      ? "Save Changes"
                      : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;