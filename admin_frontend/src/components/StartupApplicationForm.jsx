import React, { useState, useRef } from 'react';
import { Upload, X, FileText, ArrowRight, ChevronRight } from 'lucide-react';

const STEPS = [
  { id: 1, name: 'Personal Information' },
  { id: 2, name: 'Company Details' },
  { id: 3, name: 'Business Information' },
  { id: 4, name: 'Team Details' },
  { id: 5, name: 'Funding Information' },
  { id: 6, name: 'Documents Upload' },
  { id: 7, name: 'Support & Additional Info' },
];

// Document Viewer Modal
const DocumentViewerModal = ({ isOpen, onClose, documents }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-dark-card rounded-2xl w-full max-w-md animate-scale-in">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-dark-border">
          <h3 className="text-lg font-semibold text-secondary dark:text-white">Founder ID / Aadhar Card / PAN Card</h3>
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

const StartupApplicationForm = ({ onClose, onSubmit, initialData }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showDocViewer, setShowDocViewer] = useState(false);
  const fileInputRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: initialData?.fullName || '',
    mobile: initialData?.mobile || '',
    email: initialData?.email || '',
    founderIdDocuments: [],
    
    // Company Details
    companyName: initialData?.companyName || '',
    entityType: initialData?.entityType || '',
    registrationNumber: '',
    incorporationDate: '',
    gstNumber: '',
    
    // Business Information
    sector: initialData?.sector || '',
    businessDescription: initialData?.businessDescription || '',
    productServices: '',
    targetMarket: '',
    competitiveAdvantage: '',
    
    // Team Details
    teamMembers: initialData?.teamMembers || '',
    founderExperience: '',
    coFounders: [],
    
    // Funding Information
    fundingAmount: initialData?.fundingAmount || '',
    fundingPurpose: '',
    previousFunding: initialData?.previousFunding || '',
    currentRevenue: '',
    
    // Documents
    pitchDeck: null,
    businessPlan: null,
    financialStatements: null,
    
    // Support & Additional Info
    mentorshipNeeded: '',
    additionalNotes: '',
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
      updateFormData(field, fileList);
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

  const handleCancel = () => {
    onClose && onClose();
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
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
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary dark:text-white mb-2">Email ID</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="Text Input"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Document Upload Section */}
            <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6">
              <label className="block text-sm font-medium text-secondary dark:text-white mb-4">Founder ID / Aadhar Card / PAN Card</label>
              
              {/* Drag & Drop Area */}
              <div 
                className="border-2 border-dashed border-primary/30 rounded-xl p-6 text-center cursor-pointer hover:border-primary transition-colors duration-200"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFileUpload('founderIdDocuments', e.dataTransfer.files);
                }}
              >
                <p className="text-primary font-medium mb-2">Drag & Drop the file or Browse</p>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-dark-border rounded-lg text-sm text-gray-600 dark:text-gray-400 mx-auto hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <Upload className="w-4 h-4" />
                  Upload PDF
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileUpload('founderIdDocuments', e.target.files)}
                />

                {/* Uploaded Files */}
                {formData.founderIdDocuments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {formData.founderIdDocuments.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-dark-border rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{doc.name}</span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile('founderIdDocuments', index);
                          }}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* View uploaded documents link */}
              <button 
                onClick={() => setShowDocViewer(true)}
                className="text-primary hover:text-primary-hover text-sm font-medium mt-4 transition-colors"
              >
                View uploaded Documents
              </button>

              {/* Info text */}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                Supported file format - PDF only
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                For the person filling this form and signing other self-declaration documents from authorised signatory of the applicant for filling and representing the organisation for this application
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-secondary dark:text-white mb-2">Company Name</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => updateFormData('companyName', e.target.value)}
                placeholder="Enter company name"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary dark:text-white mb-2">Entity Type</label>
                <select
                  value={formData.entityType}
                  onChange={(e) => updateFormData('entityType', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select entity type</option>
                  <option value="pvt_ltd">Private Limited</option>
                  <option value="llp">LLP</option>
                  <option value="opc">OPC</option>
                  <option value="partnership">Partnership</option>
                  <option value="sole_proprietor">Sole Proprietor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary dark:text-white mb-2">Registration Number</label>
                <input
                  type="text"
                  value={formData.registrationNumber}
                  onChange={(e) => updateFormData('registrationNumber', e.target.value)}
                  placeholder="CIN/LLPIN"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary dark:text-white mb-2">Incorporation Date</label>
                <input
                  type="date"
                  value={formData.incorporationDate}
                  onChange={(e) => updateFormData('incorporationDate', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary dark:text-white mb-2">GST Number (Optional)</label>
                <input
                  type="text"
                  value={formData.gstNumber}
                  onChange={(e) => updateFormData('gstNumber', e.target.value)}
                  placeholder="Enter GST number"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-secondary dark:text-white mb-2">Sector / Industry</label>
              <select
                value={formData.sector}
                onChange={(e) => updateFormData('sector', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              >
                <option value="">Select sector</option>
                <option value="fintech">FinTech Finance</option>
                <option value="healthtech">HealthTech</option>
                <option value="edtech">EdTech</option>
                <option value="agritech">AgriTech</option>
                <option value="cleantech">CleanTech</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary dark:text-white mb-2">Business Description</label>
              <textarea
                value={formData.businessDescription}
                onChange={(e) => updateFormData('businessDescription', e.target.value)}
                placeholder="Describe your business in detail..."
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary dark:text-white mb-2">Products / Services</label>
              <textarea
                value={formData.productServices}
                onChange={(e) => updateFormData('productServices', e.target.value)}
                placeholder="Describe your products or services..."
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary dark:text-white mb-2">Total Team Members</label>
                <input
                  type="number"
                  value={formData.teamMembers}
                  onChange={(e) => updateFormData('teamMembers', e.target.value)}
                  placeholder="Enter number"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary dark:text-white mb-2">Founder Experience (Years)</label>
                <input
                  type="number"
                  value={formData.founderExperience}
                  onChange={(e) => updateFormData('founderExperience', e.target.value)}
                  placeholder="Enter years"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary dark:text-white mb-2">Co-founders (if any)</label>
              <textarea
                value={formData.coFounders}
                onChange={(e) => updateFormData('coFounders', e.target.value)}
                placeholder="List co-founders with their roles..."
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary dark:text-white mb-2">Funding Amount Required</label>
                <input
                  type="text"
                  value={formData.fundingAmount}
                  onChange={(e) => updateFormData('fundingAmount', e.target.value)}
                  placeholder="Rs. Amount"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary dark:text-white mb-2">Current Revenue (if any)</label>
                <input
                  type="text"
                  value={formData.currentRevenue}
                  onChange={(e) => updateFormData('currentRevenue', e.target.value)}
                  placeholder="Rs. Amount"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary dark:text-white mb-2">Funding Purpose</label>
              <textarea
                value={formData.fundingPurpose}
                onChange={(e) => updateFormData('fundingPurpose', e.target.value)}
                placeholder="How will you use the funding?"
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary dark:text-white mb-2">Previous Funding (if any)</label>
              <input
                type="text"
                value={formData.previousFunding}
                onChange={(e) => updateFormData('previousFunding', e.target.value)}
                placeholder="Details of previous funding rounds"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">Upload required documents. All files should be in PDF format.</p>
            
            {['pitchDeck', 'businessPlan', 'financialStatements'].map((docType) => (
              <div key={docType} className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-4">
                <label className="block text-sm font-medium text-secondary dark:text-white mb-3 capitalize">
                  {docType.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <div 
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors duration-200"
                  onClick={() => document.getElementById(`file-${docType}`).click()}
                >
                  <p className="text-sm text-gray-500 dark:text-gray-400">Click to upload or drag and drop</p>
                  <input
                    id={`file-${docType}`}
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => handleFileUpload(docType, e.target.files)}
                  />
                  {formData[docType]?.length > 0 && (
                    <div className="mt-2 text-sm text-primary font-medium">
                      {formData[docType][0].name}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-secondary dark:text-white mb-2">Mentorship Required</label>
              <select
                value={formData.mentorshipNeeded}
                onChange={(e) => updateFormData('mentorshipNeeded', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              >
                <option value="">Select option</option>
                <option value="yes">Yes, I need mentorship</option>
                <option value="no">No, not at this time</option>
                <option value="maybe">Open to opportunities</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary dark:text-white mb-2">Additional Notes</label>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) => updateFormData('additionalNotes', e.target.value)}
                placeholder="Any additional information you'd like to share..."
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-border border border-gray-200 dark:border-dark-border rounded-xl text-sm text-secondary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary dark:text-white mb-2">
          Startup <span className="text-primary italic font-serif">Application</span>
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          All Form Fields Are Required Unless Specifically Stated As &quot;Optional.&quot; The Application Form Should Be Filled Out In The English Language.
        </p>
      </div>

      {/* Step Tabs */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
        {STEPS.map((step, index) => (
          <button
            key={step.id}
            onClick={() => setCurrentStep(step.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              currentStep === step.id
                ? 'bg-primary text-secondary'
                : 'bg-gray-100 dark:bg-dark-border text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {step.name}
          </button>
        ))}
      </div>

      {/* Form Content */}
      <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-8 mb-6">
        {renderStepContent()}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleCancel}
          className="px-6 py-3 border-2 border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200"
        >
          CANCEL
        </button>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          Step {currentStep}/7
        </div>

        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-secondary font-semibold rounded-xl hover:bg-primary-hover transition-all duration-300 active:scale-[0.98]"
        >
          {currentStep === 7 ? 'Submit Application' : 'Save And Next'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Document Viewer Modal */}
      <DocumentViewerModal 
        isOpen={showDocViewer}
        onClose={() => setShowDocViewer(false)}
        documents={formData.founderIdDocuments.length > 0 ? formData.founderIdDocuments : [{ name: 'BREATHING NATURES PRIVATE LIMITED LOA_.pdf' }]}
      />
    </div>
  );
};

export default StartupApplicationForm;
