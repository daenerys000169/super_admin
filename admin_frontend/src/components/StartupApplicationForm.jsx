import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, FileText, ArrowRight, ArrowLeft, ChevronDown, ChevronUp, Plus, Minus, Calendar, Trash2, Check } from 'lucide-react';

// Hook to handle click outside
const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

const STEPS = [
  { id: 1, name: 'Personal Information' },
  { id: 2, name: 'Company Details' },
  { id: 3, name: 'Business Information' },
  { id: 4, name: 'Team Details' },
  { id: 5, name: 'Funding Information' },
  { id: 6, name: 'Documents Upload' },
  { id: 7, name: 'Support & Additional Info' },
];

// Custom Dropdown Component matching Figma exactly
const CustomDropdown = ({ label, placeholder, options, value, onChange, required, showTags = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Close dropdown when clicking outside
  useClickOutside(dropdownRef, () => setIsOpen(false));

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-secondary dark:text-white mb-2">
          {label}{required && '*'}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-left flex items-center justify-between focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
      >
        <span className={value ? 'text-secondary dark:text-white' : 'text-[#5B6178]'}>
          {showTags && value ? placeholder : (selectedOption?.label || placeholder)}
        </span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-[#5B6178]" />
        ) : (
          <ChevronDown className="w-5 h-5 text-[#5B6178]" />
        )}
      </button>

      {/* Selected Tags - shown below dropdown */}
      {showTags && value && (
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-dark-border rounded-lg text-sm text-secondary dark:text-gray-300">
            {selectedOption?.label}
            <button onClick={() => onChange('')} className="hover:text-red-500 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        </div>
      )}

      {/* Dropdown Menu - matching Figma with yellow highlight on first/selected item */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl shadow-lg overflow-hidden animate-fade-in">
          {options.map((option, index) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-6 py-4 text-left text-sm transition-all duration-200 border-b border-gray-100 dark:border-dark-border last:border-b-0 ${
                value === option.value 
                  ? 'bg-[#FFF7E2] border-l-4 border-l-primary text-secondary dark:text-white font-medium' 
                  : index === 0 && !value
                    ? 'bg-[#FFF7E2] text-[#5B6178] dark:text-gray-300'
                    : 'text-[#5B6178] dark:text-gray-300 hover:bg-[#FFF7E2]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Multi-Select Dropdown Component matching Figma exactly
const MultiSelectDropdown = ({ label, placeholder, options, value = [], onChange, required }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Close dropdown when clicking outside
  useClickOutside(dropdownRef, () => setIsOpen(false));

  const toggleOption = (optionValue) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const removeOption = (optionValue) => {
    onChange(value.filter(v => v !== optionValue));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-secondary dark:text-white mb-2">
          {label}{required && '*'}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-left flex items-center justify-between focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
      >
        <span className="text-[#5B6178]">
          {placeholder}
        </span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-[#5B6178]" />
        ) : (
          <ChevronDown className="w-5 h-5 text-[#5B6178]" />
        )}
      </button>

      {/* Selected Tags - shown below dropdown */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {value.map(v => {
            const option = options.find(opt => opt.value === v);
            return (
              <span key={v} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-dark-border rounded-lg text-sm text-secondary dark:text-gray-300">
                {option?.label}
                <button onClick={() => removeOption(v)} className="hover:text-red-500 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Dropdown Menu - matching Figma with checkboxes */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl shadow-lg overflow-hidden animate-fade-in max-h-80 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleOption(option.value)}
              className={`w-full px-6 py-4 text-left text-sm transition-all duration-200 flex items-center gap-3 border-b border-gray-100 dark:border-dark-border last:border-b-0 ${
                value.includes(option.value)
                  ? 'text-[#5B6178] dark:text-white bg-white'
                  : 'text-[#5B6178] dark:text-gray-300'
              } hover:bg-gray-50 dark:hover:bg-dark-border`}
            >
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                value.includes(option.value)
                  ? 'bg-[#4B9FE4] border-[#4B9FE4]'
                  : 'border-[#5B6178] dark:border-gray-500 bg-white'
              }`}>
                {value.includes(option.value) && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className={value.includes(option.value) ? 'text-[#5B6178] font-medium' : 'text-[#5B6178]'}>
                {option.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// File Upload Component matching Figma
const FileUploadArea = ({ label, files = [], onUpload, onRemove, onView }) => {
  const fileInputRef = useRef(null);

  return (
    <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6 animate-fade-in">
      <label className="block text-sm font-medium text-secondary dark:text-white mb-4">{label}</label>
      
      {/* Drag & Drop Area */}
      <div 
        className="border-2 border-dashed border-primary/30 bg-primary/5 rounded-xl p-6 text-center cursor-pointer hover:border-primary transition-all duration-200"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          onUpload(e.dataTransfer.files);
        }}
      >
        <p className="text-primary font-medium mb-3">Drag & Drop the file or Browse</p>
        <button 
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Upload className="w-4 h-4" />
          Upload PDF
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.ppt,.pptx"
          multiple
          className="hidden"
          onChange={(e) => onUpload(e.target.files)}
        />

        {/* Uploaded Files */}
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((doc, index) => (
              <div key={index} className="flex items-center justify-between px-3 py-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white border border-gray-200 rounded flex items-center justify-center">
                    <FileText className="w-4 h-4 text-red-500" />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[200px]">{doc.name}</span>
                </div>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(index);
                  }}
                  className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View uploaded documents link */}
      {files.length > 0 && (
        <button 
          type="button"
          onClick={onView}
          className="text-primary hover:text-primary-hover text-sm font-medium mt-4 underline transition-colors"
        >
          View uploaded Documents
        </button>
      )}

      {/* Info text */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
        Supported file format - PDF/PPT
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        For the person filling this form and signing other self-declaration documents from authorised signatory of the applicant for filling and representing the organisation for this application
      </p>
    </div>
  );
};

// Number Counter Component matching Figma
const NumberCounter = ({ label, value, onChange, min = 0, max = 100 }) => {
  const decrease = () => {
    if (value > min) onChange(value - 1);
  };

  const increase = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-secondary dark:text-white mb-2">{label}</label>
      <div className="inline-flex items-center gap-1">
        <button
          type="button"
          onClick={decrease}
          className="w-10 h-10 flex items-center justify-center bg-white dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Minus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
        <div className="w-14 h-10 flex items-center justify-center bg-primary/10 border border-primary/30 rounded-lg text-sm font-medium text-secondary dark:text-white">
          {value}
        </div>
        <button
          type="button"
          onClick={increase}
          className="w-10 h-10 flex items-center justify-center bg-white dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
    </div>
  );
};

// Document Viewer Modal
const DocumentViewerModal = ({ isOpen, onClose, title, documents }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-dark-card rounded-2xl w-full max-w-md animate-scale-in">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-dark-border">
          <h3 className="text-lg font-semibold text-secondary dark:text-white">{title}</h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-5">
          {documents?.map((doc, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-border rounded-xl mb-3">
              <div className="w-10 h-10 bg-white dark:bg-dark-card rounded-lg flex items-center justify-center border border-gray-200 dark:border-dark-border">
                <FileText className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-secondary dark:text-white line-clamp-2">{doc.name}</p>
              </div>
            </div>
          ))}
          <a 
            href="#" 
            className="text-primary hover:text-primary-hover text-sm font-medium underline transition-colors"
          >
            View
          </a>
        </div>
      </div>
    </div>
  );
};

// Dropdown Options
const ENTITY_TYPES = [
  { value: 'proprietorship', label: 'Proprietorship' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'llp', label: 'LLP' },
  { value: 'private_limited', label: 'Private Limited' },
  { value: 'opc', label: 'OPC' },
  { value: 'other', label: 'Other' },
];

const SECTORS = [
  { value: 'it_software', label: 'IT / Software' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'fintech', label: 'FinTech' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'other', label: 'Other' },
];

const CURRENT_STAGES = [
  { value: 'idea_stage', label: 'Idea Stage' },
  { value: 'prototype', label: 'Prototype' },
  { value: 'mvp', label: 'MVP' },
  { value: 'early_revenue', label: 'Early Revenue' },
  { value: 'growth_stage', label: 'Growth Stage to Revenue Generating' },
];

const INTERESTED_SUPPORT = [
  { value: 'funding', label: 'Funding' },
  { value: 'mentorship', label: 'Mentorship' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'incubation', label: 'Incubation' },
  { value: 'market_access', label: 'Market Access' },
  { value: 'technical_support', label: 'Technical Support' },
  { value: 'legal_support', label: 'Legal Support' },
];

const SCHEME_NAMES = [
  { value: 'iyogdan', label: 'iYogdan' },
  { value: 'mahila_empowerment', label: 'Mahila Empowerment Scheme' },
];

const HEAR_ABOUT_US = [
  { value: 'google', label: 'Google' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'referral', label: 'Referral' },
  { value: 'event', label: 'Event' },
  { value: 'advertisement', label: 'Advertisement' },
  { value: 'other', label: 'Other' },
];

const StartupApplicationForm = ({ onClose, onSubmit, initialData }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showDocViewer, setShowDocViewer] = useState(false);
  const [docViewerTitle, setDocViewerTitle] = useState('');
  const [docViewerDocs, setDocViewerDocs] = useState([]);
  const fileInputRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    // Step 1 - Personal Information
    fullName: initialData?.fullName || '',
    mobile: initialData?.mobile || '',
    email: initialData?.email || '',
    founderIdDocuments: [],
    
    // Step 2 - Company Details
    companyName: initialData?.companyName || '',
    entityType: initialData?.entityType || '',
    incorporationDate: '',
    cinNumber: '',
    registeredAddress: '',
    
    // Step 3 - Business Information
    sector: '',
    otherSector: '',
    businessDescription: '',
    problemSolves: '',
    targetAudience: '',
    revenueModel: '',
    currentStage: '',
    
    // Step 4 - Team Details
    foundersDetails: '',
    teamMembersDetails: '',
    fullTimeEmployees: 2,
    
    // Step 5 - Funding Information
    fundingAmountRequired: '',
    previousFunding: '',
    currentRevenue: '',
    fundingPurpose: '',
    
    // Step 6 - Documents
    pitchDeck: [],
    registrationCertificate: [],
    msmeCertificate: [],
    
    // Step 7 - Support & Additional Info
    interestedSupport: [],
    schemeName: '',
    websiteUrl: '',
    socialMediaLinks: [''],
    awardsRecognition: '',
    hearAboutUs: '',
    confirmInfo: false,
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field, files) => {
    if (files && files.length > 0) {
      const fileList = Array.from(files).map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        file
      }));
      updateFormData(field, [...formData[field], ...fileList]);
    }
  };

  const removeFile = (field, index) => {
    const newFiles = [...formData[field]];
    newFiles.splice(index, 1);
    updateFormData(field, newFiles);
  };

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    } else {
      onSubmit && onSubmit(formData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCancel = () => {
    onClose && onClose();
  };

  const addSocialMediaLink = () => {
    updateFormData('socialMediaLinks', [...formData.socialMediaLinks, '']);
  };

  const updateSocialMediaLink = (index, value) => {
    const newLinks = [...formData.socialMediaLinks];
    newLinks[index] = value;
    updateFormData('socialMediaLinks', newLinks);
  };

  const openDocViewer = (title, docs) => {
    setDocViewerTitle(title);
    setDocViewerDocs(docs);
    setShowDocViewer(true);
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-secondary dark:text-white mb-2">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => updateFormData('fullName', e.target.value)}
                placeholder="Text Input"
                className="w-full px-4 py-3 bg-primary/10 border border-primary/30 rounded-xl text-sm text-secondary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Mobile & Email Row */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary dark:text-white mb-2">Mobile No.</label>
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => updateFormData('mobile', e.target.value)}
                  placeholder="No. Input"
                  className="w-full px-4 py-3 bg-white dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary dark:text-white mb-2">Email ID</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="Text Input"
                  className="w-full px-4 py-3 bg-white dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Document Upload Section */}
            <FileUploadArea
              label="Founder ID / Aadhar Card / PAN Card"
              files={formData.founderIdDocuments}
              onUpload={(files) => handleFileUpload('founderIdDocuments', files)}
              onRemove={(index) => removeFile('founderIdDocuments', index)}
              onView={() => openDocViewer('Founder ID / Aadhar Card / PAN Card', formData.founderIdDocuments)}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            {/* Company Name & Entity Type Row */}
            <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary dark:text-white mb-2">Company Name</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => updateFormData('companyName', e.target.value)}
                    placeholder="Text Input"
                    className="w-full px-4 py-3 bg-white dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  />
                </div>
                <CustomDropdown
                  label="Entity Type"
                  placeholder="Select Dropdown"
                  options={ENTITY_TYPES}
                  value={formData.entityType}
                  onChange={(val) => updateFormData('entityType', val)}
                  showTags={true}
                />
              </div>
            </div>

            {/* Incorporation Date & CIN Number */}
            <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary dark:text-white mb-2">Incorporation/Registration Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={formData.incorporationDate}
                      onChange={(e) => updateFormData('incorporationDate', e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Date of application should not be more than 2<br />years from incorporation
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary dark:text-white mb-2">CIN Number</label>
                  <input
                    type="text"
                    value={formData.cinNumber}
                    onChange={(e) => updateFormData('cinNumber', e.target.value)}
                    placeholder="Text Input"
                    className="w-full px-4 py-3 bg-white dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Registered Address */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-secondary dark:text-white mb-2">Registered Address</label>
                <input
                  type="text"
                  value={formData.registeredAddress}
                  onChange={(e) => updateFormData('registeredAddress', e.target.value)}
                  placeholder="Text Input"
                  className="w-full px-4 py-3 bg-primary/10 border border-primary/30 rounded-xl text-sm text-secondary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            {/* Sector */}
            <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6">
              <div className="grid grid-cols-2 gap-6">
                <CustomDropdown
                  label="Sector"
                  placeholder="Select Dropdown"
                  options={SECTORS}
                  value={formData.sector}
                  onChange={(val) => updateFormData('sector', val)}
                  showTags={true}
                />
                <div>
                  <label className="block text-sm font-medium text-secondary dark:text-white mb-2">Other Sector</label>
                  <input
                    type="text"
                    value={formData.otherSector}
                    onChange={(e) => updateFormData('otherSector', e.target.value)}
                    placeholder="Text Input"
                    className="w-full px-4 py-3 bg-white dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white placeholder-primary/50 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Business Description & Problem */}
            <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary dark:text-white mb-2">Business Description</label>
                  <textarea
                    value={formData.businessDescription}
                    onChange={(e) => updateFormData('businessDescription', e.target.value)}
                    placeholder="Textarea"
                    rows={4}
                    className="w-full px-4 py-3 bg-white dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary dark:text-white mb-2">Problem Your Startup Solves</label>
                  <textarea
                    value={formData.problemSolves}
                    onChange={(e) => updateFormData('problemSolves', e.target.value)}
                    placeholder="Textarea"
                    rows={4}
                    className="w-full px-4 py-3 bg-white dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-secondary dark:text-white mb-2">Target Audience</label>
                  <textarea
                    value={formData.targetAudience}
                    onChange={(e) => updateFormData('targetAudience', e.target.value)}
                    placeholder="Textarea"
                    rows={4}
                    className="w-full px-4 py-3 bg-white dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary dark:text-white mb-2">Revenue Model</label>
                  <textarea
                    value={formData.revenueModel}
                    onChange={(e) => updateFormData('revenueModel', e.target.value)}
                    placeholder="Textarea"
                    rows={4}
                    className="w-full px-4 py-3 bg-white dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
                  />
                </div>
              </div>

              {/* Current Stage */}
              <div className="mt-6">
                <CustomDropdown
                  label="Current Stage"
                  placeholder="Select Dropdown"
                  options={CURRENT_STAGES}
                  value={formData.currentStage}
                  onChange={(val) => updateFormData('currentStage', val)}
                  showTags={true}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6">
              {/* Founders Details */}
              <div>
                <label className="block text-sm font-medium text-secondary dark:text-white mb-2">Founders Details</label>
                <textarea
                  value={formData.foundersDetails}
                  onChange={(e) => updateFormData('foundersDetails', e.target.value)}
                  placeholder="Textarea"
                  rows={4}
                  className="w-full px-4 py-3 bg-white dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>

              {/* Team Members Details */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-secondary dark:text-white mb-2">Team Members Details</label>
                <textarea
                  value={formData.teamMembersDetails}
                  onChange={(e) => updateFormData('teamMembersDetails', e.target.value)}
                  placeholder="Textarea"
                  rows={4}
                  className="w-full px-4 py-3 bg-white dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>

              {/* Full-Time Employees Counter */}
              <div className="mt-6">
                <NumberCounter
                  label="Full-Time Employees"
                  value={formData.fullTimeEmployees}
                  onChange={(val) => updateFormData('fullTimeEmployees', val)}
                  min={0}
                  max={1000}
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary dark:text-white mb-2">Funding Amount Required</label>
                  <input
                    type="text"
                    value={formData.fundingAmountRequired}
                    onChange={(e) => updateFormData('fundingAmountRequired', e.target.value)}
                    placeholder="Rs. Amount"
                    className="w-full px-4 py-3 bg-white dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary dark:text-white mb-2">Previous Funding (if any)</label>
                  <input
                    type="text"
                    value={formData.previousFunding}
                    onChange={(e) => updateFormData('previousFunding', e.target.value)}
                    placeholder="Rs. Amount"
                    className="w-full px-4 py-3 bg-white dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-secondary dark:text-white mb-2">Current Revenue (if any)</label>
                  <input
                    type="text"
                    value={formData.currentRevenue}
                    onChange={(e) => updateFormData('currentRevenue', e.target.value)}
                    placeholder="Rs. Amount"
                    className="w-full px-4 py-3 bg-white dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary dark:text-white mb-2">Purpose of Funding</label>
                  <input
                    type="text"
                    value={formData.fundingPurpose}
                    onChange={(e) => updateFormData('fundingPurpose', e.target.value)}
                    placeholder="Text Input"
                    className="w-full px-4 py-3 bg-white dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6 animate-fade-in">
            {/* Pitch Deck */}
            <FileUploadArea
              label="Pitch Deck"
              files={formData.pitchDeck}
              onUpload={(files) => handleFileUpload('pitchDeck', files)}
              onRemove={(index) => removeFile('pitchDeck', index)}
              onView={() => openDocViewer('Pitch Deck', formData.pitchDeck)}
            />

            {/* Registration Certificate/GST Certificate */}
            <FileUploadArea
              label="Registration Certificate/GST Certificate"
              files={formData.registrationCertificate}
              onUpload={(files) => handleFileUpload('registrationCertificate', files)}
              onRemove={(index) => removeFile('registrationCertificate', index)}
              onView={() => openDocViewer('Registration Certificate/GST Certificate', formData.registrationCertificate)}
            />

            {/* MSME Certificate */}
            <FileUploadArea
              label="MSME Certificate"
              files={formData.msmeCertificate}
              onUpload={(files) => handleFileUpload('msmeCertificate', files)}
              onRemove={(index) => removeFile('msmeCertificate', index)}
              onView={() => openDocViewer('MSME Certificate', formData.msmeCertificate)}
            />
          </div>
        );

      case 7:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Interested Support */}
                <MultiSelectDropdown
                  label="Support Needed From Us"
                  placeholder="Multi-Select Dropdown"
                  options={INTERESTED_SUPPORT}
                  value={formData.interestedSupport}
                  onChange={(val) => updateFormData('interestedSupport', val)}
                  required
                />

                {/* Scheme Name */}
                <CustomDropdown
                  label="Scheme Name"
                  placeholder="Select Scheme"
                  options={SCHEME_NAMES}
                  value={formData.schemeName}
                  onChange={(val) => updateFormData('schemeName', val)}
                  showTags={true}
                />
              </div>
            </div>

            <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6">
              {/* Website URL */}
              <div>
                <label className="block text-sm font-medium text-secondary dark:text-white mb-2">Website URL</label>
                <input
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) => updateFormData('websiteUrl', e.target.value)}
                  placeholder="URL Input"
                  className="w-full px-4 py-3 bg-white dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Social Media Links */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-secondary dark:text-white mb-2">Social Media Links</label>
                {formData.socialMediaLinks.map((link, index) => (
                  <input
                    key={index}
                    type="url"
                    value={link}
                    onChange={(e) => updateSocialMediaLink(index, e.target.value)}
                    placeholder="Text Input"
                    className="w-full px-4 py-3 bg-white dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 mb-2"
                  />
                ))}
                <button
                  type="button"
                  onClick={addSocialMediaLink}
                  className="text-primary hover:text-primary-hover text-sm font-medium transition-colors"
                >
                  + Add More
                </button>
              </div>

              {/* Awards / Recognition */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-secondary dark:text-white mb-2">Awards / Recognition</label>
                <textarea
                  value={formData.awardsRecognition}
                  onChange={(e) => updateFormData('awardsRecognition', e.target.value)}
                  placeholder="Textarea"
                  rows={3}
                  className="w-full px-4 py-3 bg-white dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>

              {/* How did you hear about us */}
              <div className="mt-6">
                <CustomDropdown
                  label="How did you hear about us?"
                  placeholder="Select hear about us"
                  options={HEAR_ABOUT_US}
                  value={formData.hearAboutUs}
                  onChange={(val) => updateFormData('hearAboutUs', val)}
                  showTags={true}
                />
              </div>
            </div>

            {/* Confirmation Checkbox */}
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => updateFormData('confirmInfo', !formData.confirmInfo)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  formData.confirmInfo
                    ? 'bg-[#4B9FE4] border-[#4B9FE4]'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                {formData.confirmInfo && <Check className="w-3 h-3 text-white" />}
              </button>
              <span className="text-sm text-secondary dark:text-gray-300">
                I Confirm That All Information Provided Is Correct
              </span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-dark-bg min-h-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary dark:text-white">
          Startup <span className="text-primary font-dancing italic">Application</span>
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          All Form Fields Are Required Unless Specifically Stated As "Optional." The Application Form Should Be Filled Out In The English Language.
        </p>
      </div>

      {/* Step Tabs */}
      <div className="flex gap-1 mb-8 overflow-x-auto pb-2">
        {STEPS.map((step) => (
          <button
            key={step.id}
            onClick={() => setCurrentStep(step.id)}
            className={`px-4 py-2.5 text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-200 ${
              currentStep === step.id
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-dark-card text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border'
            }`}
          >
            {step.name}
          </button>
        ))}
      </div>

      {/* Form Content */}
      <div className="mb-8">
        {renderStepContent()}
      </div>

      {/* Footer Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-dark-border">
        <button
          type="button"
          onClick={handleCancel}
          className="px-6 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg text-sm font-medium text-secondary dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-border transition-all duration-200"
        >
          CANCEL
        </button>

        <span className="text-sm text-gray-500 dark:text-gray-400">
          Step {currentStep}/7
        </span>

        <div className="flex items-center gap-3">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrevious}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg text-sm font-medium text-secondary dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-border transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-all duration-200"
          >
            {currentStep === 7 ? 'Save Applications' : 'Save And Next'}
            {currentStep !== 7 && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={showDocViewer}
        onClose={() => setShowDocViewer(false)}
        title={docViewerTitle}
        documents={docViewerDocs}
      />
    </div>
  );
};

export default StartupApplicationForm;
