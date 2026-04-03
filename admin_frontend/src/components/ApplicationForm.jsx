import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Upload, Check, Building, 
  Users, FileText, DollarSign, Info } from 'lucide-react';
import API from '../utils/axiosInstance';

function ApplicationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [draftId, setDraftId] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const formRef = useRef(null);
  
  // Add a flag to track if we're creating a draft
  const [isCreatingDraft, setIsCreatingDraft] = useState(false);
  
  const [formData, setFormData] = useState({
    // Basic Details
    fullName: '',
    mobile: '',
    email: '',
    companyName: '',
    entityType: '',
    incorporationDate: '',
    registrationNumber: '',
    registeredAddress: '',
    
    // Sector/Industry
    sectors: [],
    otherSector:'',
    
    // Founder & Team
    foundersDetails: '',
    teamMembers: '',
    
    // Business Profile
    businessDescription: '',
    problemSolving: '',
    targetAudience: '',
    revenueModel: '',
    currentStage: '',
    
    // Documents
    pitchDeck: null,
    registrationCert: null,
    panCard: null,
    gstCert: null,
    msmeCert: null,
    founderId: null,
    
    // Funding
    previousFunding: '',
    previousFundingDetails: '',
    fundingAmount: '',
    fundingPurpose: '',
    interestedSupport: [],
    otherSupport:'',
    
    // Additional Info
    website: '',
    socialMedia: '',
    awards: '',
    hearAboutUs: ''
  });

  const totalSteps = 7;
  const stepTitles = [
    'Basic Details',
    'Sector/Industry',
    'Founder & Team',
    'Business Profile',
    'Document Uploads',
    'Funding/Support',
    'Additional Info'
  ];

  const stepIcons = [
    Building,
    Users,
    Users,
    FileText,
    Upload,
    DollarSign,
    Info
  ];

  const validateStep = (step) => {
    switch(step) {
      case 1:
        return (
          formData.fullName.trim() !== '' &&
          formData.mobile.trim() !== '' &&
          formData.email.trim() !== '' &&
          formData.companyName.trim() !== '' &&
          formData.entityType.trim() !== '' &&
          formData.registeredAddress.trim() !== ''
        );
      case 2:
        return (
          formData.sectors.length > 0 &&
          (!formData.sectors.includes("Others") || formData.otherSector.trim() !== "")
        );
      case 3:
        return (
          formData.foundersDetails.trim() !== '' &&
          formData.teamMembers !== '' &&
          !isNaN(Number(formData.teamMembers)) && Number(formData.teamMembers) > 0
        );
      case 4:
        return (
          formData.businessDescription.trim() !== '' &&
          formData.problemSolving.trim() !== '' &&
          formData.targetAudience.trim() !== '' &&
          formData.revenueModel.trim() !== '' &&
          formData.currentStage.trim() !== ''
        );
      case 5:
        return (
          formData.pitchDeck !== null &&
          formData.registrationCert !== null &&
          formData.panCard !== null &&
          formData.founderId !== null
        );
      case 6:
        return (
          formData.previousFunding.trim() !== '' &&
          formData.fundingAmount.trim() !== '' &&
          formData.fundingPurpose.trim() !== '' &&
          (formData.previousFunding === 'No' || formData.previousFundingDetails.trim() !== '')
        );
      case 7:
        return formData.hearAboutUs.trim() !== '';
      default:
        return true;
    }
  };

  const entityTypes = [
    'Private Limited Company',
    'LLP',
    'Partnership Firm',
    'Sole Proprietorship',
    'NGO (Section 8 / Trust / Society)',
    'Other'
  ];

  const sectors = [
    'Agriculture / AgriTech',
    'Education / EdTech',
    'Healthcare / HealthTech',
    'Environment / Sustainability',
    'FinTech / Finance',
    'Artificial Intelligence / Machine Learning',
    'E-commerce / Retail',
    'Manufacturing / Industry 4.0',
    'Renewable Energy / Cleantech',
    'Skilling / Employment / HRTech',
    'Mobility / Transportation / EV',
    'Construction / Real Estate',
    'Travel / Hospitality / Tourism',
    'Food / FoodTech / FMCG',
    'Social Impact / NGO / Community Development',
    'Women Empowerment / Gender Equality',
    'Water & Sanitation / Hygiene',
    'IT / SaaS / Software Services',
    'Fashion / Lifestyle',
    'Media / Entertainment / Content',
    'Legal / Regulatory / Compliance',
    'Cybersecurity',
    'Others'
  ];

  const currentStages = [
    'Idea Stage',
    'Prototype / MVP Ready',
    'Early Revenue',
    'Scaling',
    'Established',
    'Non-profit in Operations'
  ];

  const supportTypes = [
    'Mentorship',
    'Incubation Program',
    'Strategic Partnerships',
    'Legal/Financial Support',
    'Investor Connect',
    'Other'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiSelect = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleFileUpload = (field, file) => {
    const maxSize = 10 * 1024 * 1024; // 10 MB in bytes
    if (file && file.size > maxSize) {
      alert("File is too large! Maximum allowed size is 10MB.");
      return;
    }
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ 
          top: 0, 
          behavior: 'smooth' 
        });
      }
    } else {
      alert('Please fill all required fields before proceeding.');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
    }
  };

 // Modified function to create or update draft
const createOrUpdateDraft = async () => {
  if (!userId || isCreatingDraft) {;
    return null;
  }

  setIsCreatingDraft(true);
  
  try {
    const { pitchDeck, registrationCert, panCard, gstCert, msmeCert, founderId, ...draftData } = formData;
    const payload = { userId, ...draftData };
    
    if (draftId) {

      const response = await API.put(`/applications/draft/${draftId}`, payload);

      return draftId;
    } else {

      const response = await API.post('/applications/draft', payload);
   
      // FIX: Check for draftId instead of id
      if (response.data && response.data.draftId) {
        const newDraftId = response.data.draftId;
        setDraftId(newDraftId);
        return newDraftId;
      } else {
        throw new Error('No draft ID returned from server');
      }
    }
  } catch (error) {

    throw error;
  } finally {
    setIsCreatingDraft(false);
  }
};

  const submitForm = async () => {
    
    try {
      // Ensure we have a draft before submitting
      let currentDraftId = draftId;
      
      if (!currentDraftId) {
        currentDraftId = await createOrUpdateDraft();
        
        // If still no draftId, show error
        if (!currentDraftId) {
          alert("Unable to create draft. Please check your internet connection and try again.");
          return;
        }
      }

      const data = new FormData();

      // Add form data to FormData object
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'userId') return;
        if (Array.isArray(value)) {
          value.forEach(item => data.append(key, item));
        } else if (value !== null && value !== undefined) {
          data.append(key, value);
        }
      });

      data.append("userId", userId);

      setLoading(true);
      
      // PATCH existing draft to finalize it
      const response = await API.patch(`/applications/submit/${currentDraftId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const generatedId = response.data.applicationId || currentDraftId;

      navigate('/application-submitted', { state: { applicationId: generatedId } });
    } catch (error) {
      
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      alert(`Submission failed: ${errorMessage}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  // Modified autosave function
  function useAutosaveDraft(userId, formData) {
    const timeoutRef = useRef();
    useEffect(() => {
      if (!userId) {
        return;
      }
      
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(async () => {
        try {
          await createOrUpdateDraft();
        } catch (error) {
          console.error('Autosave failed:', error);
          // Don't show alerts for autosave failures as they're automatic
        }
      }, 1500);
      
      return () => clearTimeout(timeoutRef.current);
    }, [userId, formData]);
  }

  useAutosaveDraft(userId, formData);

  // Load existing draft on component mount
  useEffect(() => {
    if (!userId) {
      return;
    }
    const loadDraft = async () => {
      try {
        const response = await API.get(`/applications/draft/${userId}`);

        if (response.data && response.data.id) {

          setFormData(old => ({ ...old, ...response.data }));
          setDraftId(response.data.id);
        } else {
          console.log('No existing draft found');
        }
      } catch (error) {
        console.error('Failed to load draft:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        
        // If it's a 404, that's normal (no draft exists yet)
        if (error.response?.status !== 404) {
          console.warn('Unexpected error loading draft:', error);
        }
      }
    };

    loadDraft();
  }, [userId]);


  return (
    <div className="min-h-screen py-4 sm:py-8 font-sans">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-2 text-secondary font-spartan">
            Startup Yogdaan
          </h1>
          <p className="text-center text-gray-600 text-sm sm:text-base lg:text-lg px-2">
            Application Form for Funding | Incubation | Mentorship | Business Support
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Progress Indicator */}
        <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg">
          {/* Desktop Progress Bar */}
          <div className="hidden lg:flex justify-between items-center">
            {Array.from({ length: totalSteps }, (_, index) => {
              const step = index + 1;
              const Icon = stepIcons[index];
              const isActive = step === currentStep;
              const isCompleted = step < currentStep;
              
              return (
                <div key={step} className="flex flex-col items-center flex-1">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isActive 
                        ? 'bg-primary text-white shadow-lg transform scale-110' 
                        : isCompleted 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {isCompleted ? <Check size={16} /> : <Icon size={16} />}
                  </div>
                  <span 
                    className={`mt-2 text-xs font-medium text-center ${
                      isActive ? 'text-primary font-bold' : 'text-gray-600'
                    }`}
                  >
                    {stepTitles[index]}
                  </span>
                  {step < totalSteps && (
                    <div 
                      className={`h-1 w-full mt-3 rounded ${
                        step < currentStep ? 'bg-primary opacity-100' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile Progress Bar */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-primary">
                  {React.createElement(stepIcons[currentStep - 1], { size: 14 })}
                </div>
                <div>
                  <div className="text-sm font-bold text-primary">
                    Step {currentStep} of {totalSteps}
                  </div>
                  <div className="text-xs text-gray-600">
                    {stepTitles[currentStep - 1]}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300 bg-primary"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div ref={formRef} className="bg-white rounded-lg sm:rounded-xl shadow-xl overflow-hidden">
          <div className="p-4 sm:p-6 text-white bg-primary">
            <h2 className="text-lg sm:text-xl font-bold mb-1">
              Section {currentStep}: {stepTitles[currentStep - 1]}
            </h2>
            <p className="opacity-90 text-sm">
              Please fill in all required information accurately
            </p>
          </div>

          <div className="p-4 sm:p-6">
            {/* Step 1: Basic Details */}
            {currentStep === 1 && (
              <div className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name of Applicant *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => handleInputChange('mobile', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm"
                      placeholder="WhatsApp-enabled number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Startup / Company / NGO / MSME Name *
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm"
                      placeholder="Your organization name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Type of Entity *
                    </label>
                    <select
                      value={formData.entityType}
                      onChange={(e) => handleInputChange('entityType', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm"
                    >
                      <option value="">Select entity type</option>
                      {entityTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date of Incorporation / Registration
                    </label>
                    <input
                      type="date"
                      value={formData.incorporationDate}
                      onChange={(e) => handleInputChange('incorporationDate', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company/NGO Registration Number
                  </label>
                  <input
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm"
                    placeholder="CIN / Trust Reg. No., etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Registered Address *
                  </label>
                  <textarea
                    value={formData.registeredAddress}
                    onChange={(e) => handleInputChange('registeredAddress', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm"
                    placeholder="Enter complete registered address"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Sector/Industry */}
            {currentStep === 2 && (
              <div className="space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Which Sector/Industry Do You Operate In? * (Select all that apply)
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {sectors.map((sector) => (
                      <label
                        key={sector}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                          formData.sectors.includes(sector)
                            ? 'border-2 border-primary bg-yellow-50 shadow-md'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.sectors.includes(sector)}
                          onChange={() => handleMultiSelect('sectors', sector)}
                          className="sr-only"
                        />
                        <div
                          className={`w-4 h-4 rounded mr-3 flex items-center justify-center flex-shrink-0 ${
                            formData.sectors.includes(sector)
                              ? 'bg-primary text-white'
                              : 'border-2 border-gray-300'
                          }`}
                        >
                          {formData.sectors.includes(sector) && <Check size={12} />}
                        </div>
                        <span className="text-sm font-medium text-gray-700 leading-tight">{sector}</span>
                      </label>
                    ))}
                  </div>

                  {/* Conditional Textbox for Others */}
                  {formData.sectors.includes('Others') && (
                    <div className="mt-4">
                      <input
                        type="text"
                        placeholder="Please specify your sector"
                        value={formData.otherSector || ''}
                        required
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, otherSector: e.target.value }))
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Founder & Team */}
            {currentStep === 3 && (
              <div className="space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Founders' / Directors' Details *
                  </label>
                  <textarea
                    value={formData.foundersDetails}
                    onChange={(e) => handleInputChange('foundersDetails', e.target.value)}
                    rows="4"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm"
                    placeholder="Name, Role, Educational Background, Experience"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Total Number of Team Members *
                  </label>
                  <input
                    type="number"
                    value={formData.teamMembers}
                    onChange={(e) => handleInputChange('teamMembers', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm"
                    placeholder="Enter number of team members"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Business Profile */}
            {currentStep === 4 && (
              <div className="space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Brief Description of Your Business or NGO Mission * 
                  </label>
                  <textarea
                    value={formData.businessDescription}
                    onChange={(e) => handleInputChange('businessDescription', e.target.value)}
                    rows="4"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm"
                    placeholder="Describe your business or NGO mission..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    What Problem Are You Solving? *
                  </label>
                  <textarea
                    value={formData.problemSolving}
                    onChange={(e) => handleInputChange('problemSolving', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm"
                    placeholder="Describe the problem you're addressing..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Who is Your Target Audience or Beneficiary Group? *
                  </label>
                  <textarea
                    value={formData.targetAudience}
                    onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm"
                    placeholder="Describe your target audience..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Business or Revenue Model *
                  </label>
                  <textarea
                    value={formData.revenueModel}
                    onChange={(e) => handleInputChange('revenueModel', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm"
                    placeholder="How do you earn or plan to earn revenue?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Stage of Your Organization *
                  </label>
                  <select
                    value={formData.currentStage}
                    onChange={(e) => handleInputChange('currentStage', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm"
                  >
                    <option value="">Select current stage</option>
                    {currentStages.map((stage) => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Step 5: Document Uploads */}
            {currentStep === 5 && (
              <div className="space-y-4 sm:space-y-5">
                {[
                  { field: 'pitchDeck', label: 'Upload Your Pitch Deck (PDF) *', required: true },
                  { field: 'registrationCert', label: 'Upload Registration Certificate *', required: true },
                  { field: 'panCard', label: 'Upload Company / NGO PAN Card *', required: true },
                  { field: 'gstCert', label: 'Upload GST Certificate (if applicable)', required: false },
                  { field: 'msmeCert', label: 'Upload MSME Certificate (if available)', required: false },
                  { field: 'founderId', label: 'Upload Founder\'s Aadhar card *', required: true }
                ].map(({ field, label, required }) => (
                  <div key={field}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {label}
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors duration-200">
                      <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-gray-600 mb-1 text-sm">
                        {formData[field] ? formData[field].name : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-gray-400 text-xs">Max file size: 10MB</p>
                      <input
                        type="file"
                        onChange={(e) => handleFileUpload(field, e.target.files[0])}
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        id={field}
                      />
                      <label
                        htmlFor={field}
                        className="inline-block mt-2 px-3 py-1.5 bg-primary text-white text-sm rounded-lg cursor-pointer hover:opacity-90 transition-opacity duration-200"
                      >
                        Choose File
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 6: Funding/Support */}
            {currentStep === 6 && (
              <div className="space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Have You Raised Any Funding Before? *
                  </label>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    {['Yes', 'No'].map((option) => (
                      <label
                        key={option}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                          formData.previousFunding === option
                            ? 'border-2 border-primary bg-yellow-50 shadow-md'
                            : 'border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="previousFunding"
                          checked={formData.previousFunding === option}
                          onChange={() => handleInputChange('previousFunding', option)}
                          className="sr-only"
                        />
                        <div 
                          className={`w-4 h-4 rounded-full mr-3 border-2 ${
                            formData.previousFunding === option ? 'bg-primary border-transparent' : 'border-gray-300'
                          }`}
                        />
                        <span className="font-medium text-gray-700 text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {formData.previousFunding === 'Yes' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Previous Funding Details
                    </label>
                    <textarea
                      value={formData.previousFundingDetails}
                      onChange={(e) => handleInputChange('previousFundingDetails', e.target.value)}
                      rows="3"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm"
                      placeholder="Please mention amount and source"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    How Much Funding / Support Are You Looking For? *
                  </label>
                  <input
                    type="text"
                    value={formData.fundingAmount}
                    onChange={(e) => handleInputChange('fundingAmount', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm"
                    placeholder="Amount in ₹"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Purpose of Funding / Support *
                  </label>
                  <textarea
                    value={formData.fundingPurpose}
                    onChange={(e) => handleInputChange('fundingPurpose', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm"
                    placeholder="e.g. Product Development, Hiring, Operations, Marketing, R&D, Infrastructure, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Are You Interested in Any of the Following? (Select all that apply)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {supportTypes.map((support) => (
                      <label
                        key={support}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                          formData.interestedSupport.includes(support)
                            ? 'border-2 border-primary bg-yellow-50 shadow-md'
                            : 'border-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.interestedSupport.includes(support)}
                          onChange={() => handleMultiSelect('interestedSupport', support)}
                          className="sr-only"
                        />
                        <div 
                          className={`w-4 h-4 rounded mr-3 flex items-center justify-center flex-shrink-0 ${
                            formData.interestedSupport.includes(support) ? 'bg-primary text-white' : 'border-2 border-gray-300'
                          }`}
                        >
                          {formData.interestedSupport.includes(support) && <Check size={12} />}
                        </div>
                        <span className="font-medium text-gray-700 text-sm">{support}</span>
                      </label>
                    ))}
                  </div>

                  {/* Conditional Text Input for "Other" */}
                  {formData.interestedSupport.includes('Other') && (
                    <div className="mt-4">
                      <input
                        type="text"
                        placeholder="Please specify your interest"
                        value={formData.otherSupport || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, otherSupport: e.target.value }))
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 7: Additional Information */}
            {currentStep === 7 && (
              <div className="space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Website (if available)
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm"
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Social Media Handles
                  </label>
                  <textarea
                    value={formData.socialMedia}
                    onChange={(e) => handleInputChange('socialMedia', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm"
                    placeholder="LinkedIn / Instagram / Facebook etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Any Awards, Recognitions or Achievements?
                  </label>
                  <textarea
                    value={formData.awards}
                    onChange={(e) => handleInputChange('awards', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm"
                    placeholder="List any awards or achievements..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    How Did You Hear About Us? *
                  </label>
                  <input
                    type="text"
                    value={formData.hearAboutUs}
                    onChange={(e) => handleInputChange('hearAboutUs', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm"
                    placeholder="Social media, website, referral, etc."
                  />
                </div>

                {/* Declaration */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-base font-semibold text-gray-800 mb-3">Declaration</h3>
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-1 flex-shrink-0"
                      required
                    />
                    <span className="text-sm text-gray-700 leading-relaxed">
                      I hereby declare that the information provided above is accurate and true to the best of my knowledge. 
                      I am authorized to submit this application on behalf of my organization.
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="bg-gray-50 px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`w-full sm:w-auto flex items-center justify-center px-4 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm ${
                currentStep === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              <ChevronLeft size={16} className="mr-2" />
              Previous
            </button>

            <span className="text-gray-600 font-medium text-sm order-first sm:order-none">
              Step {currentStep} of {totalSteps}
            </span>

            {currentStep === totalSteps ? (
              <button
                onClick={submitForm}
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition-all duration-200 shadow-lg text-sm"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <Check size={16} className="ml-2" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="w-full sm:w-auto flex items-center justify-center px-4 py-2.5 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition-all duration-200 shadow-lg text-sm"
              >
                Next
                <ChevronRight size={16} className="ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicationForm;