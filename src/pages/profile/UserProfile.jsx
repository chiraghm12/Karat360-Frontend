import React, { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth, DEFAULT_USER } from "../../context/AuthContext";
import PageMeta from "../../components/common/PageMeta";
import { FaLinkedinIn, FaUserCircle, RiPencilFill } from "../../icons";
import ToastMessage from "../../components/common/ToastMessage";
import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import PhoneInput from "../../components/form/input/PhoneInput";
import Button from "../../components/ui/button/Button";
import RingLoader from "../../components/common/RingLoader";
import FilterDropdown from "../../components/common/FilterDropdown";
import {
  Shield,
  Sparkles,
  Building2,
  Key,
  Sliders,
  HelpCircle,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Award,
  Lock,
  Smartphone,
  FileCheck,
  Crown,
  Camera,
  X,
  Store,
  Clock,
  Laptop,
  Check,
  AlertCircle
} from "lucide-react";

const UserProfile = ({ defaultTab = "profile" }) => {
  const { user: authUser, updateUser, loading } = useAuth();
  const user = authUser || DEFAULT_USER;

  const [searchParams, setSearchParams] = useSearchParams();
  const currentTabFromUrl = searchParams.get("tab") || defaultTab;
  const [activeTab, setActiveTab] = useState(currentTabFromUrl);

  useEffect(() => {
    const tab = searchParams.get("tab") || defaultTab;
    setActiveTab(tab);
  }, [searchParams, defaultTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  // Edit Personal Information Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [form, setForm] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    bio: user?.bio || "",
    phone_number: user?.phone_number || "",
    role: user?.role || "Shop Owner & Administrator",
    city: user?.city || "Mumbai",
  });
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(user?.profile_photo || null);
  const fileInputRef = useRef(null);

  // Store & Business Form State
  const [storeForm, setStoreForm] = useState({
    store_name: user?.store_name || "Karat360 Fine Jewellery",
    store_code: user?.store_code || "K360-MUM-01",
    address: user?.address || "Showroom 12, Gold Souk, Zaveri Bazaar, Kalbadevi, Mumbai - 400002",
    city: user?.city || "Mumbai",
    state: user?.state || "Maharashtra",
    gstin: user?.gstin || "27AABCK3601M1ZP",
    bis_license: user?.bis_license || "HM/C-7821903",
  });
  const [storeSaving, setStoreSaving] = useState(false);

  // Settings & Preferences Form State
  const [prefForm, setPrefForm] = useState({
    currency: user?.currency || "INR (₹)",
    default_karat: user?.default_karat || "22K",
    timezone: user?.timezone || "Asia/Kolkata (IST)",
    date_format: user?.date_format || "DD/MM/YYYY",
    invoice_prefix: user?.invoice_prefix || "INV-2026-",
    huid_tracking: user?.huid_tracking ?? true,
    email_notifications: user?.email_notifications ?? true,
    sms_alerts: user?.sms_alerts ?? true,
  });
  const [prefSaving, setPrefSaving] = useState(false);

  // Security Form State
  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [securitySaving, setSecuritySaving] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.two_factor ?? true);

  const countries = [
    { code: "IN", label: "+91 " },
    { code: "AE", label: "+971 " },
    { code: "US", label: "+1 " },
    { code: "GB", label: "+44 " },
    { code: "SG", label: "+65 " },
  ];

  const fullName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.name ||
    "Chirag Mehta";
  const initials = `${user?.first_name?.[0] || "C"}${user?.last_name?.[0] || "M"}`.toUpperCase();

  const openEditModal = () => {
    setForm({
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      bio: user?.bio || "",
      phone_number: user?.phone_number || "",
      role: user?.role || "Shop Owner & Administrator",
      city: user?.city || "Mumbai",
    });
    setPreview(user?.profile_photo || null);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone_number") {
      const sanitized = value.replace(/[^\d()+\-\s]/g, "");
      setForm((prev) => ({ ...prev, [name]: sanitized }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTextAreaChange = (value) => {
    setForm((prev) => ({ ...prev, bio: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      updateUser({
        ...form,
        profile_photo: preview,
      });
      ToastMessage.success("Personal profile updated successfully");
      closeEditModal();
    } catch (error) {
      console.error("Failed to update user profile:", error);
      ToastMessage.error("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveStore = (e) => {
    e.preventDefault();
    setStoreSaving(true);
    setTimeout(() => {
      updateUser({ ...storeForm });
      setStoreSaving(false);
      ToastMessage.success("Store details updated successfully");
    }, 400);
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    setPrefSaving(true);
    setTimeout(() => {
      updateUser({ ...prefForm });
      setPrefSaving(false);
      ToastMessage.success("System preferences saved successfully");
    }, 400);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!securityForm.currentPassword) {
      ToastMessage.error("Please enter your current password");
      return;
    }
    if (securityForm.newPassword.length < 8) {
      ToastMessage.error("New password must be at least 8 characters");
      return;
    }
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      ToastMessage.error("New password confirmation does not match");
      return;
    }

    setSecuritySaving(true);
    setTimeout(() => {
      setSecuritySaving(false);
      setSecurityForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      ToastMessage.success("Password updated securely");
    }, 600);
  };

  return (
    <>
      <PageMeta
        title="Account Settings & Profile | Karat360"
        description="Comprehensive Profile, Store Setup, and Account Settings for Karat360 Jewellery Management"
      />

      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
              <span>Account Settings & Profile</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25">
                Merchant Admin
              </span>
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage personal credentials, BIS hallmark store licenses, pricing preferences, and security settings.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* ========================================================================= */}
        {/* TOP HERO PROFILE CARD (Referenced from MoneyTracker) */}
        {/* ========================================================================= */}
        <div className="p-6 border border-gray-200 rounded-3xl bg-white dark:border-gray-800 dark:bg-gray-900 shadow-sm relative overflow-hidden">
          {/* Subtle background ambient gold glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between relative z-10">
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center w-full">
              {/* Profile Avatar */}
              <div className="relative group flex-shrink-0">
                <div className="w-22 h-22 rounded-full overflow-hidden border-2 border-amber-400/40 dark:border-amber-500/30 p-0.5 bg-white dark:bg-gray-800 shadow-md">
                  {user?.profile_photo ? (
                    <img
                      src={user.profile_photo}
                      alt={fullName}
                      className="object-cover w-full h-full rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 flex items-center justify-center text-gray-950 font-bold text-2xl tracking-wider shadow-inner">
                      {initials}
                    </div>
                  )}
                </div>

                {/* Camera quick edit icon */}
                <button
                  type="button"
                  onClick={openEditModal}
                  className="absolute bottom-0 right-0 p-2 rounded-full bg-amber-500 text-gray-950 shadow-md hover:bg-amber-400 transition-all hover:scale-105"
                  title="Change Profile Picture"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* User Details & Badges */}
              <div className="text-center sm:text-left space-y-1.5 grow">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {loading ? "Loading..." : fullName}
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    BIS Certified Merchant
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-gray-500 dark:text-gray-400 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-500" />
                    {user?.email || "chirag.m@karat360.com"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-500" />
                    {user?.phone_number || "+91 98200 11223"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    {user?.city || "Mumbai"}, India
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-lg">
                    <Crown className="w-3 h-3 text-amber-500" />
                    {user?.role || "Shop Owner & Administrator"}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-lg">
                    <Store className="w-3 h-3 text-amber-500" />
                    {user?.store_name || "Karat360 Fine Jewellery"} ({user?.store_code || "K360-MUM-01"})
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end mt-2 sm:mt-0">
                <button
                  onClick={openEditModal}
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-xs hover:bg-amber-50 hover:text-amber-600 hover:border-amber-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-amber-500/10 dark:hover:text-amber-400 dark:hover:border-amber-500/30 transition-all"
                >
                  <RiPencilFill className="w-4 h-4 fill-current" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* NAVIGATION TABS */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-gray-200 dark:border-gray-800 pb-1 scrollbar-none">
          {[
            { id: "profile", label: "Personal Profile", icon: FaUserCircle },
            { id: "store", label: "Store & BIS Details", icon: Building2 },
            { id: "settings", label: "Preferences & Rates", icon: Sliders },
            { id: "security", label: "Security & Passwords", icon: Shield },
            { id: "support", label: "Support & Hotline", icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-xs"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-amber-500" : "text-gray-400"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: PERSONAL PROFILE */}
        {/* ========================================================================= */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Personal Information Card */}
            <div className="lg:col-span-2 p-6 border border-gray-200 rounded-3xl bg-white dark:border-gray-800 dark:bg-gray-900 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                    Personal Information
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Your direct identity and contact details across the Karat360 platform.
                  </p>
                </div>
                <button
                  onClick={openEditModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition"
                >
                  <RiPencilFill className="w-3.5 h-3.5 fill-current" />
                  Edit
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <span className="block text-xs font-semibold text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-wider">
                    First Name
                  </span>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {user?.first_name || "Chirag"}
                  </p>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-wider">
                    Last Name
                  </span>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {user?.last_name || "Mehta"}
                  </p>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-wider">
                    Email Address
                  </span>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {user?.email || "chirag.m@karat360.com"}
                  </p>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-wider">
                    Mobile Phone
                  </span>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {user?.phone_number || "+91 98200 11223"}
                  </p>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-wider">
                    Platform Role
                  </span>
                  <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                    {user?.role || "Shop Owner & Administrator"}
                  </p>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-wider">
                    Showroom City / Region
                  </span>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {user?.city || "Mumbai"}, Maharashtra
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <span className="block text-xs font-semibold text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-wider">
                    Executive Biography & Specialization
                  </span>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-white/[0.02] p-3.5 rounded-2xl border border-gray-100 dark:border-gray-800">
                    {user?.bio ||
                      "Managing Director & Certified Gemologist at Karat360 Fine Jewellery. Overseeing showroom inventory, high-value diamond transactions, and BIS hallmarking compliance."}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats & Security Overview */}
            <div className="space-y-6">
              <div className="p-6 border border-gray-200 rounded-3xl bg-white dark:border-gray-800 dark:bg-gray-900 shadow-sm space-y-4">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  Merchant Accreditation
                </h4>
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold block">
                        BIS Hallmark License
                      </span>
                      <span className="font-mono font-bold text-gray-900 dark:text-white text-sm">
                        {user?.bis_license || "HM/C-7821903"}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-gray-950">
                      ACTIVE
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-gray-500 dark:text-gray-400 block">
                        GSTIN Number
                      </span>
                      <span className="font-mono font-bold text-gray-800 dark:text-white text-xs">
                        {user?.gstin || "27AABCK3601M1ZP"}
                      </span>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>

                  <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-gray-500 dark:text-gray-400 block">
                        Account Created
                      </span>
                      <span className="font-bold text-gray-800 dark:text-white">
                        October 2024 (Verified)
                      </span>
                    </div>
                    <FileCheck className="w-4 h-4 text-amber-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: STORE & BUSINESS PROFILE */}
        {/* ========================================================================= */}
        {activeTab === "store" && (
          <div className="p-7 border border-gray-200 rounded-3xl bg-white dark:border-gray-800 dark:bg-gray-900 shadow-sm space-y-6 max-w-4xl">
            <div className="pb-4 border-b border-gray-100 dark:border-gray-800">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-amber-500" />
                Jewellery Showroom & Business Details
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                These business credentials appear on your customer tax invoices, hallmark certificates, and ledger records.
              </p>
            </div>

            <form onSubmit={handleSaveStore} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Jewellery Store Name *
                  </label>
                  <input
                    type="text"
                    value={storeForm.store_name}
                    onChange={(e) => setStoreForm({ ...storeForm, store_name: e.target.value })}
                    required
                    className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Branch Store Code
                  </label>
                  <input
                    type="text"
                    value={storeForm.store_code}
                    onChange={(e) => setStoreForm({ ...storeForm, store_code: e.target.value })}
                    className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    GSTIN Registration Number *
                  </label>
                  <input
                    type="text"
                    value={storeForm.gstin}
                    onChange={(e) => setStoreForm({ ...storeForm, gstin: e.target.value })}
                    required
                    placeholder="27AABCK3601M1ZP"
                    className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    BIS Hallmark Registration No. *
                  </label>
                  <input
                    type="text"
                    value={storeForm.bis_license}
                    onChange={(e) => setStoreForm({ ...storeForm, bis_license: e.target.value })}
                    required
                    placeholder="HM/C-7821903"
                    className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Primary Showroom Address *
                </label>
                <textarea
                  rows={2}
                  value={storeForm.address}
                  onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
                  required
                  placeholder="Showroom number, building name, street, landmark, pincode..."
                  className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    City / Souk
                  </label>
                  <input
                    type="text"
                    value={storeForm.city}
                    onChange={(e) => setStoreForm({ ...storeForm, city: e.target.value })}
                    className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    State / Province
                  </label>
                  <input
                    type="text"
                    value={storeForm.state}
                    onChange={(e) => setStoreForm({ ...storeForm, state: e.target.value })}
                    className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
                <Button variant="primary" type="submit" disabled={storeSaving} className="px-6 py-2.5">
                  {storeSaving ? (
                    <span className="flex items-center gap-2">
                      <RingLoader className="w-4 h-4" /> Saving Details...
                    </span>
                  ) : (
                    "Save Business Details"
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: SETTINGS & PREFERENCES */}
        {/* ========================================================================= */}
        {activeTab === "settings" && (
          <div className="p-7 border border-gray-200 rounded-3xl bg-white dark:border-gray-800 dark:bg-gray-900 shadow-sm space-y-6 max-w-4xl">
            <div className="pb-4 border-b border-gray-100 dark:border-gray-800">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-500" />
                System & Jewellery Rate Preferences
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Configure primary billing currency, default gold karat display, and invoice generation sequences.
              </p>
            </div>

            <form onSubmit={handleSavePreferences} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Default Currency
                  </label>
                  <FilterDropdown
                    value={prefForm.currency}
                    onChange={(val) => setPrefForm({ ...prefForm, currency: val })}
                    options={[
                      { value: 'INR (₹)', label: 'Indian Rupee (INR ₹)' },
                      { value: 'USD ($)', label: 'US Dollar (USD $)' },
                      { value: 'AED (د.إ)', label: 'UAE Dirham (AED د.إ)' },
                      { value: 'GBP (£)', label: 'British Pound (GBP £)' },
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Primary Karatage Standard
                  </label>
                  <FilterDropdown
                    value={prefForm.default_karat}
                    onChange={(val) => setPrefForm({ ...prefForm, default_karat: val })}
                    options={[
                      { value: '22K', label: '22K (91.6% BIS Hallmark - Standard Bridal)' },
                      { value: '24K', label: '24K (99.9% Pure Investment Bars / Bullion)' },
                      { value: '18K', label: '18K (75.0% Diamond Studded Jewellery)' },
                      { value: '14K', label: '14K (58.5% Everyday Modern Gold)' },
                    ]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Invoice Numbering Prefix
                  </label>
                  <input
                    type="text"
                    value={prefForm.invoice_prefix}
                    onChange={(e) => setPrefForm({ ...prefForm, invoice_prefix: e.target.value })}
                    placeholder="INV-2026-"
                    className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Date Format
                  </label>
                  <FilterDropdown
                    value={prefForm.date_format}
                    onChange={(val) => setPrefForm({ ...prefForm, date_format: val })}
                    options={[
                      { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (Indian Standard)' },
                      { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US Format)' },
                      { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO Format)' },
                    ]}
                  />
                </div>
              </div>

              {/* Notification Toggles */}
              <div className="space-y-3 pt-2">
                <h5 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  Automated Workflow Features
                </h5>

                <label className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 cursor-pointer hover:border-amber-500/40 transition">
                  <div>
                    <span className="text-sm font-semibold text-gray-800 dark:text-white block">
                      Enforce BIS Hallmark HUID Tracking
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mt-0.5">
                      Prompts for 6-digit alphanumeric hallmark identifier when registering new gold items.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefForm.huid_tracking}
                    onChange={(e) => setPrefForm({ ...prefForm, huid_tracking: e.target.checked })}
                    className="w-5 h-5 accent-amber-500 rounded-md cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 cursor-pointer hover:border-amber-500/40 transition">
                  <div>
                    <span className="text-sm font-semibold text-gray-800 dark:text-white block">
                      Send Instant Invoice Copy via Email
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mt-0.5">
                      Automatically delivers generated GST PDF invoices to customers with valid email addresses.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefForm.email_notifications}
                    onChange={(e) => setPrefForm({ ...prefForm, email_notifications: e.target.checked })}
                    className="w-5 h-5 accent-amber-500 rounded-md cursor-pointer"
                  />
                </label>
              </div>

              <div className="flex items-center justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
                <Button variant="primary" type="submit" disabled={prefSaving} className="px-6 py-2.5">
                  {prefSaving ? (
                    <span className="flex items-center gap-2">
                      <RingLoader className="w-4 h-4" /> Saving Preferences...
                    </span>
                  ) : (
                    "Save Preferences"
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: SECURITY & PASSWORD */}
        {/* ========================================================================= */}
        {activeTab === "security" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Password Change Form */}
            <div className="lg:col-span-2 p-7 border border-gray-200 rounded-3xl bg-white dark:border-gray-800 dark:bg-gray-900 shadow-sm space-y-6">
              <div className="pb-4 border-b border-gray-100 dark:border-gray-800">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Key className="w-5 h-5 text-amber-500" />
                  Change Administrator Password
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Ensure your account is protected with a secure password containing numbers, letters, and symbols.
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Current Password *
                  </label>
                  <input
                    type="password"
                    value={securityForm.currentPassword}
                    onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                    required
                    placeholder="Enter current password"
                    className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      New Password *
                    </label>
                    <input
                      type="password"
                      value={securityForm.newPassword}
                      onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                      required
                      placeholder="Minimum 8 characters"
                      className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      value={securityForm.confirmPassword}
                      onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                      required
                      placeholder="Re-type new password"
                      className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
                  <Button variant="primary" type="submit" disabled={securitySaving} className="px-6 py-2.5">
                    {securitySaving ? (
                      <span className="flex items-center gap-2">
                        <RingLoader className="w-4 h-4" /> Updating Password...
                      </span>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {/* 2FA & Active Sessions */}
            <div className="space-y-6">
              <div className="p-6 border border-gray-200 rounded-3xl bg-white dark:border-gray-800 dark:bg-gray-900 shadow-sm space-y-4">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  Two-Factor Authentication
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Protect showroom sales data with SMS or Authenticator verification during login.
                </p>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800">
                  <span className="text-xs font-bold text-gray-800 dark:text-white">
                    2FA Status: {twoFactorEnabled ? "Active" : "Disabled"}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = !twoFactorEnabled;
                      setTwoFactorEnabled(next);
                      updateUser({ two_factor: next });
                      ToastMessage.success(next ? "2FA Enabled successfully" : "2FA Disabled");
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                      twoFactorEnabled
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {twoFactorEnabled ? "ENABLED" : "ENABLE NOW"}
                  </button>
                </div>
              </div>

              <div className="p-6 border border-gray-200 rounded-3xl bg-white dark:border-gray-800 dark:bg-gray-900 shadow-sm space-y-3">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-amber-500" />
                  Active Sessions
                </h4>
                <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 dark:text-white">Windows 11 • Chrome</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      CURRENT
                    </span>
                  </div>
                  <p className="text-gray-400 text-[11px]">Mumbai, India • Last active 2 minutes ago</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: SUPPORT & HOTLINE */}
        {/* ========================================================================= */}
        {activeTab === "support" && (
          <div className="p-7 border border-gray-200 rounded-3xl bg-white dark:border-gray-800 dark:bg-gray-900 shadow-sm space-y-6 max-w-4xl">
            <div className="pb-4 border-b border-gray-100 dark:border-gray-800">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-500" />
                Karat360 Merchant Support & Helpdesk
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Direct hotline and dedicated assistance for jewellery billing, BIS Hallmark syncing, and accounting exports.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 text-center space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                  <Phone className="w-5 h-5" />
                </div>
                <h5 className="text-sm font-bold text-gray-900 dark:text-white">Merchant Hotline</h5>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">+91 1800 360 5272</p>
                <span className="inline-block text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                  Toll-Free (9 AM - 8 PM IST)
                </span>
              </div>

              <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 text-center space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                  <Mail className="w-5 h-5" />
                </div>
                <h5 className="text-sm font-bold text-gray-900 dark:text-white">Email Desk</h5>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">support@karat360.com</p>
                <span className="inline-block text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  Avg response: 15 mins
                </span>
              </div>

              <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 text-center space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                  <Building2 className="w-5 h-5" />
                </div>
                <h5 className="text-sm font-bold text-gray-900 dark:text-white">Headquarters</h5>
                <p className="text-xs text-gray-500 dark:text-gray-400">Zaveri Bazaar, Mumbai</p>
                <span className="inline-block text-[11px] text-gray-400 font-medium">
                  Gold Souk Complex
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* EDIT PERSONAL INFORMATION MODAL (Referenced directly from MoneyTracker) */}
      {/* ========================================================================= */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 dark:bg-black/80 backdrop-blur-md z-[2000] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-gray-200 dark:border-gray-800 p-7 sm:p-9 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
                  <FaUserCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Edit Personal Information
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Update your executive name, photo, phone, and biography.
                  </p>
                </div>
              </div>
              <button
                onClick={closeEditModal}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleEditSubmit}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
                  e.preventDefault();
                }
              }}
              className="space-y-5"
            >
              {/* Photo Upload with Click to Change */}
              <div className="flex flex-col items-center justify-center py-2">
                <div
                  className="w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-amber-500/50 flex items-center justify-center cursor-pointer group relative shadow-md bg-amber-500/5"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  title="Click to select new profile photo"
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="object-cover w-full h-full group-hover:opacity-75 transition-opacity"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-400 to-yellow-600 text-gray-950 font-bold text-2xl flex items-center justify-center group-hover:opacity-85 transition-opacity">
                      {initials}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="mt-2 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
                >
                  Click to Change Photo
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </div>

              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    First Name *
                  </label>
                  <Input
                    type="text"
                    name="first_name"
                    value={form.first_name}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Last Name *
                  </label>
                  <Input
                    type="text"
                    name="last_name"
                    value={form.last_name}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                  />
                </div>
              </div>

              {/* Role & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Designation / Title
                  </label>
                  <Input
                    type="text"
                    name="role"
                    value={form.role}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Showroom City
                  </label>
                  <Input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Phone Number
                </label>
                <PhoneInput
                  name="phone_number"
                  value={form.phone_number}
                  countries={countries}
                  selectPosition="start"
                  placeholder="+91 98765 43210"
                  onChange={handleInputChange}
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Executive Bio & Background
                </label>
                <TextArea
                  rows={3}
                  value={form.bio}
                  onChange={handleTextAreaChange}
                  placeholder="Share details about your gemological credentials and showroom experience..."
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3.5 pt-5 border-t border-gray-100 dark:border-gray-800">
                <Button variant="outline" type="button" onClick={closeEditModal} className="px-5 py-2.5">
                  Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={saving} className="px-7 py-2.5">
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <RingLoader className="w-4 h-4" /> Saving Profile...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile;
