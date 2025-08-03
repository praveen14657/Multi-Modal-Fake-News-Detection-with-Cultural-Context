// Application data
const sampleData = {
  sampleAnalyses: [
    {
      id: 1,
      type: "text",
      content: "BREAKING: Local mayor announces massive tax cuts after secret meeting with business leaders",
      results: {
        overall_score: 35,
        text_score: 40,
        credibility: "Questionable",
        cultural_context: "en-US",
        flags: ["Sensational language", "Unverified claims", "Lacking source attribution"],
        explanation: "Content uses inflammatory language typical of misinformation. Claims lack proper sourcing and verification.",
        breakdown: {
          text: 35,
          image: 40,
          video: 30,
          audio: 35,
          cultural: 38
        }
      }
    },
    {
      id: 2,
      type: "image",
      content: "manipulated_protest_image.jpg",
      results: {
        overall_score: 15,
        image_score: 20,
        credibility: "Likely Fake",
        cultural_context: "en-US",
        flags: ["Digital manipulation detected", "Inconsistent lighting", "Cloning artifacts"],
        explanation: "Image shows signs of digital manipulation including cloned crowd elements and inconsistent lighting patterns.",
        breakdown: {
          text: 20,
          image: 15,
          video: 18,
          audio: 12,
          cultural: 22
        }
      }
    }
  ],
  culturalContexts: [
    {code: "en-US", name: "US English", region: "North America"},
    {code: "en-UK", name: "UK English", region: "Europe"},
    {code: "en-IN", name: "Indian English", region: "South Asia"},
    {code: "es-MX", name: "Spanish (Mexico)", region: "Latin America"},
    {code: "fr-FR", name: "French (France)", region: "Europe"},
    {code: "zh-CN", name: "Chinese (Simplified)", region: "East Asia"},
    {code: "ar-SA", name: "Arabic (Saudi Arabia)", region: "Middle East"}
  ]
};

// Global state
let analysisHistory = [];
let currentAnalysis = null;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing application...');
  initializeTabs();
  setupEventListeners();
  loadDemoData();
  updateAnalysisHistory();
});

// Tab navigation - Fixed implementation
function initializeTabs() {
  const tabs = document.querySelectorAll('.tab');
  console.log('Found tabs:', tabs.length);
  
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const tabType = this.getAttribute('data-tab');
      console.log('Tab clicked:', tabType, 'Index:', index);
      switchTab(tabType);
    });
  });
}

function switchTab(tabType) {
  console.log('Switching to tab:', tabType);
  
  // Remove active class from all tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Add active class to clicked tab
  const activeTab = document.querySelector(`[data-tab="${tabType}"]`);
  if (activeTab) {
    activeTab.classList.add('active');
  }
  
  // Hide all panels
  document.querySelectorAll('.panel').forEach(panel => {
    panel.classList.remove('active');
    panel.style.display = 'none';
  });
  
  // Show target panel
  const targetPanel = document.getElementById(`${tabType}-panel`);
  if (targetPanel) {
    targetPanel.classList.add('active');
    targetPanel.style.display = 'block';
    console.log('Panel switched to:', tabType);
  } else {
    console.error('Panel not found:', `${tabType}-panel`);
  }
}

// Event listeners setup
function setupEventListeners() {
  // Text input method change
  const textInputMethod = document.getElementById('text-input-method');
  if (textInputMethod) {
    textInputMethod.addEventListener('change', function() {
      const textContent = document.getElementById('text-content');
      if (this.value === 'url') {
        textContent.placeholder = 'Enter URL to analyze...';
        textContent.rows = 2;
      } else {
        textContent.placeholder = 'Paste your text content here...';
        textContent.rows = 8;
      }
    });
  }

  // File upload drag and drop
  setupDragAndDrop();
  
  // Modal backdrop clicks
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal__backdrop')) {
      const modal = e.target.closest('.modal');
      if (modal) {
        modal.classList.add('hidden');
      }
    }
  });
}

// Drag and drop functionality
function setupDragAndDrop() {
  const uploadAreas = document.querySelectorAll('.upload-area');
  
  uploadAreas.forEach(area => {
    area.addEventListener('dragover', handleDragOver);
    area.addEventListener('dragleave', handleDragLeave);
    area.addEventListener('drop', handleDrop);
  });
}

function handleDragOver(e) {
  e.preventDefault();
  e.currentTarget.style.borderColor = 'var(--color-primary)';
  e.currentTarget.style.background = 'var(--color-bg-2)';
}

function handleDragLeave(e) {
  e.preventDefault();
  e.currentTarget.style.borderColor = 'var(--color-border)';
  e.currentTarget.style.background = 'var(--color-bg-1)';
}

function handleDrop(e) {
  e.preventDefault();
  e.currentTarget.style.borderColor = 'var(--color-border)';
  e.currentTarget.style.background = 'var(--color-bg-1)';
  
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    const uploadArea = e.currentTarget;
    const input = uploadArea.querySelector('input[type="file"]');
    if (input) {
      input.files = files;
      const event = new Event('change', { bubbles: true });
      input.dispatchEvent(event);
    }
  }
}

// File upload handling
function handleFileUpload(input, type) {
  const file = input.files[0];
  if (!file) return;
  
  const previewContainer = document.getElementById(`${type}-preview`);
  const analyzeBtn = document.getElementById(`${type}-analyze-btn`);
  
  // Create preview
  if (previewContainer) {
    previewContainer.innerHTML = createFilePreview(file, type);
    previewContainer.classList.remove('empty');
  }
  
  // Enable analyze button
  if (analyzeBtn) {
    analyzeBtn.disabled = false;
  }
  
  showToast(`${file.name} uploaded successfully`, 'success');
}

function handleMultipleFileUpload(input) {
  const files = Array.from(input.files);
  const previewContainer = document.getElementById('combined-preview');
  
  if (previewContainer) {
    previewContainer.innerHTML = '';
    
    files.forEach(file => {
      const preview = createFilePreview(file, 'combined');
      previewContainer.innerHTML += preview;
    });
    
    previewContainer.classList.remove('empty');
  }
  
  showToast(`${files.length} file(s) uploaded successfully`, 'success');
}

function createFilePreview(file, type) {
  const fileSize = formatFileSize(file.size);
  const fileIcon = getFileIcon(file.type);
  
  return `
    <div class="preview-item">
      <div class="preview-icon">${fileIcon}</div>
      <div class="preview-info">
        <p class="preview-name">${file.name}</p>
        <p class="preview-size">${fileSize}</p>
      </div>
    </div>
  `;
}

function getFileIcon(fileType) {
  if (fileType.startsWith('image/')) return '🖼️';
  if (fileType.startsWith('video/')) return '🎥';
  if (fileType.startsWith('audio/')) return '🎵';
  return '📄';
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Analysis functions - Fixed implementation
async function analyzeContent(type) {
  let content = '';
  let contextData = {};
  
  console.log('Starting analysis for type:', type);
  
  // Get content based on type
  switch (type) {
    case 'text':
      const textContent = document.getElementById('text-content');
      content = textContent ? textContent.value : '';
      const culturalContext = document.getElementById('cultural-context');
      contextData.cultural_context = culturalContext ? culturalContext.value : 'en-US';
      if (!content.trim()) {
        showToast('Please enter text content to analyze', 'error');
        return;
      }
      break;
      
    case 'image':
      const imageInput = document.getElementById('image-upload');
      if (!imageInput || !imageInput.files[0]) {
        showToast('Please upload an image to analyze', 'error');
        return;
      }
      content = imageInput.files[0].name;
      break;
      
    case 'video':
      const videoInput = document.getElementById('video-upload');
      if (!videoInput || !videoInput.files[0]) {
        showToast('Please upload a video to analyze', 'error');
        return;
      }
      content = videoInput.files[0].name;
      break;
      
    case 'audio':
      const audioInput = document.getElementById('audio-upload');
      if (!audioInput || !audioInput.files[0]) {
        showToast('Please upload an audio file to analyze', 'error');
        return;
      }
      content = audioInput.files[0].name;
      break;
      
    case 'combined':
      const combinedText = document.getElementById('combined-text');
      const combinedFiles = document.getElementById('combined-files');
      const combinedCultural = document.getElementById('combined-cultural-context');
      
      const textValue = combinedText ? combinedText.value : '';
      const filesCount = combinedFiles ? combinedFiles.files.length : 0;
      contextData.cultural_context = combinedCultural ? combinedCultural.value : 'en-US';
      
      if (!textValue.trim() && filesCount === 0) {
        showToast('Please provide text content or upload files to analyze', 'error');
        return;
      }
      
      content = textValue || `${filesCount} files uploaded`;
      break;
  }
  
  // Start analysis
  showLoadingModal();
  await simulateAnalysis(type, content, contextData);
}

async function simulateAnalysis(type, content, contextData) {
  const steps = [
    'Initializing analysis...',
    'Processing content...',
    'Running AI models...',
    'Analyzing cultural context...',
    'Cross-referencing sources...',
    'Generating results...'
  ];
  
  for (let i = 0; i < steps.length; i++) {
    updateLoadingProgress(steps[i], (i + 1) / steps.length);
    await sleep(600 + Math.random() * 300);
  }
  
  // Generate mock results
  const results = generateMockResults(type, content, contextData);
  
  // Store in history
  const analysis = {
    id: Date.now(),
    type: type,
    content: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
    timestamp: new Date(),
    results: results
  };
  
  analysisHistory.unshift(analysis);
  currentAnalysis = analysis;
  
  console.log('Analysis completed:', analysis);
  
  // Update UI
  hideLoadingModal();
  displayResults(type, results);
  updateAnalysisHistory();
  showToast('Analysis completed successfully', 'success');
}

function generateMockResults(type, content, contextData) {
  const baseScore = Math.floor(Math.random() * 100);
  let credibility = 'Credible';
  let flags = [];
  
  if (baseScore < 40) {
    credibility = 'Likely Fake';
    flags = ['Suspicious patterns detected', 'Source verification failed', 'Content manipulation indicators'];
  } else if (baseScore < 70) {
    credibility = 'Questionable';
    flags = ['Inconsistent information', 'Limited source verification', 'Potential bias detected'];
  } else {
    flags = ['Content appears authentic', 'Sources verified', 'No manipulation detected'];
  }
  
  const results = {
    overall_score: baseScore,
    credibility: credibility,
    cultural_context: contextData.cultural_context || 'en-US',
    flags: flags,
    explanation: generateExplanation(type, baseScore),
    breakdown: {
      text: Math.max(0, Math.min(100, baseScore + (Math.random() - 0.5) * 20)),
      image: Math.max(0, Math.min(100, baseScore + (Math.random() - 0.5) * 20)),
      video: Math.max(0, Math.min(100, baseScore + (Math.random() - 0.5) * 20)),
      audio: Math.max(0, Math.min(100, baseScore + (Math.random() - 0.5) * 20)),
      cultural: Math.max(0, Math.min(100, baseScore + (Math.random() - 0.5) * 15))
    }
  };
  
  return results;
}

function generateExplanation(type, score) {
  const explanations = {
    high: [
      'Content appears authentic with consistent patterns and verified sources.',
      'No significant manipulation indicators detected in the analysis.',
      'Cultural context and linguistic patterns support authenticity.'
    ],
    medium: [
      'Some inconsistencies detected that require further verification.',
      'Mixed signals from different analysis modules suggest caution.',
      'Content may contain biased or unverified information.'
    ],
    low: [
      'Multiple red flags indicate potential misinformation or manipulation.',
      'Significant inconsistencies detected across analysis modules.',
      'Strong indicators of synthetic or manipulated content.'
    ]
  };
  
  const category = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';
  const options = explanations[category];
  return options[Math.floor(Math.random() * options.length)];
}

// Results display - Fixed implementation
function displayResults(type, results) {
  const resultsContainer = document.getElementById(`${type}-results`);
  console.log('Displaying results for type:', type, 'Container found:', !!resultsContainer);
  
  if (!resultsContainer) {
    console.error('Results container not found for type:', type);
    showToast('Error displaying results', 'error');
    return;
  }
  
  resultsContainer.innerHTML = createResultsHTML(results);
  resultsContainer.classList.add('analysis-result');
  
  // Animate the breakdown bars
  setTimeout(() => {
    const breakdownFills = resultsContainer.querySelectorAll('.breakdown-fill');
    breakdownFills.forEach(fill => {
      const width = fill.style.width;
      fill.style.width = '0%';
      setTimeout(() => {
        fill.style.width = width;
      }, 100);
    });
  }, 500);
}

function createResultsHTML(results) {
  const scoreClass = results.overall_score >= 70 ? 'high' : results.overall_score >= 40 ? 'medium' : 'low';
  const contextInfo = sampleData.culturalContexts.find(c => c.code === results.cultural_context);
  
  return `
    <div class="credibility-score">
      <div class="score-circle ${scoreClass}">
        ${results.overall_score}
      </div>
      <h3 class="score-label">${results.credibility}</h3>
      <p class="score-description">Confidence: ${results.overall_score}%</p>
    </div>
    
    <div class="result-section">
      <h4>Cultural Context</h4>
      <p><strong>${contextInfo ? contextInfo.name : 'Unknown'}</strong> - ${contextInfo ? contextInfo.region : 'Unknown Region'}</p>
    </div>
    
    <div class="result-section">
      <h4>Analysis Flags</h4>
      <ul class="flag-list">
        ${results.flags.map(flag => `
          <li class="flag-item">
            <span class="flag-icon">${results.overall_score < 70 ? '⚠️' : '✅'}</span>
            ${flag}
          </li>
        `).join('')}
      </ul>
    </div>
    
    <div class="result-section">
      <h4>Breakdown</h4>
      <div class="breakdown-chart">
        ${Object.entries(results.breakdown || {}).map(([key, value]) => `
          <div class="breakdown-item">
            <span class="breakdown-label">${key.charAt(0).toUpperCase() + key.slice(1)}</span>
            <div class="breakdown-bar">
              <div class="breakdown-fill ${value >= 70 ? 'high' : value >= 40 ? 'medium' : 'low'}" 
                   style="width: ${Math.round(value)}%"></div>
            </div>
            <span class="breakdown-score">${Math.round(value)}</span>
          </div>
        `).join('')}
      </div>
    </div>
    
    <div class="result-section">
      <h4>Explanation</h4>
      <p>${results.explanation}</p>
    </div>
    
    <button class="btn btn--primary btn--full-width mt-8" onclick="showDetailedResults()">
      View Detailed Report
    </button>
  `;
}

// Sample content loading - Fixed implementation
function loadSample(type) {
  console.log('Loading sample for type:', type);
  
  const sample = sampleData.sampleAnalyses.find(s => s.type === type);
  if (!sample) {
    showToast('No sample available for this analysis type', 'error');
    return;
  }
  
  switch (type) {
    case 'text':
      const textContent = document.getElementById('text-content');
      if (textContent) {
        textContent.value = sample.content;
        showToast('Sample content loaded successfully', 'success');
      } else {
        console.error('Text content element not found');
        showToast('Error loading sample content', 'error');
      }
      break;
      
    case 'image':
      // Simulate image loading
      const imagePreview = document.getElementById('image-preview');
      const imageAnalyzeBtn = document.getElementById('image-analyze-btn');
      
      if (imagePreview) {
        imagePreview.innerHTML = createFilePreview({
          name: sample.content,
          size: 1024000,
          type: 'image/jpeg'
        }, 'image');
        imagePreview.classList.remove('empty');
        
        if (imageAnalyzeBtn) {
          imageAnalyzeBtn.disabled = false;
        }
        showToast('Sample image loaded successfully', 'success');
      } else {
        console.error('Image preview element not found');
        showToast('Error loading sample image', 'error');
      }
      break;
      
    default:
      showToast('Sample loading not available for this analysis type', 'info');
  }
}

// Modal functions - Fixed implementation
function showLoadingModal() {
  const modal = document.getElementById('loading-modal');
  if (modal) {
    modal.classList.remove('hidden');
    updateLoadingProgress('Initializing analysis...', 0);
  }
}

function hideLoadingModal() {
  const modal = document.getElementById('loading-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

function updateLoadingProgress(text, progress) {
  const loadingText = document.getElementById('loading-text');
  const progressFill = document.getElementById('progress-fill');
  
  if (loadingText) loadingText.textContent = text;
  if (progressFill) progressFill.style.width = `${progress * 100}%`;
}

function showDetailedResults() {
  console.log('Showing detailed results for:', currentAnalysis);
  
  if (!currentAnalysis) {
    showToast('No analysis results to display', 'error');
    return;
  }
  
  const modal = document.getElementById('results-modal');
  const detailedResults = document.getElementById('detailed-results');
  
  if (!modal || !detailedResults) {
    console.error('Modal elements not found');
    showToast('Error opening detailed results', 'error');
    return;
  }
  
  detailedResults.innerHTML = `
    <div class="detailed-analysis">
      <h3>Analysis Summary</h3>
      <p><strong>Type:</strong> ${currentAnalysis.type.charAt(0).toUpperCase() + currentAnalysis.type.slice(1)} Analysis</p>
      <p><strong>Timestamp:</strong> ${currentAnalysis.timestamp.toLocaleString()}</p>
      <p><strong>Overall Score:</strong> ${currentAnalysis.results.overall_score}%</p>
      <p><strong>Content:</strong> ${currentAnalysis.content}</p>
      
      <h3>Detailed Findings</h3>
      ${createResultsHTML(currentAnalysis.results)}
      
      <h3>Technical Details</h3>
      <p>This analysis was performed using advanced machine learning models trained on multi-modal datasets. The system combines natural language processing, computer vision, and audio analysis techniques to provide comprehensive fake news detection with cultural context awareness.</p>
      
      <div class="export-options mt-16">
        <button class="btn btn--outline" onclick="exportReport()">Export Report</button>
      </div>
    </div>
  `;
  
  modal.classList.remove('hidden');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
  }
}

// History management - Fixed implementation
function updateAnalysisHistory() {
  const historyContainer = document.getElementById('analysis-history');
  if (!historyContainer) {
    console.error('History container not found');
    return;
  }
  
  if (analysisHistory.length === 0) {
    historyContainer.innerHTML = '<p class="text-secondary">No analyses yet</p>';
    return;
  }
  
  historyContainer.innerHTML = analysisHistory.slice(0, 5).map(analysis => `
    <div class="history-item" onclick="viewHistoryItem(${analysis.id})">
      <div class="history-type">${analysis.type} analysis</div>
      <div class="history-content">${analysis.content}</div>
      <div class="history-score ${analysis.results.overall_score >= 70 ? 'high' : analysis.results.overall_score >= 40 ? 'medium' : 'low'}">
        ${analysis.results.credibility} (${analysis.results.overall_score}%)
      </div>
    </div>
  `).join('');
}

function viewHistoryItem(id) {
  const analysis = analysisHistory.find(a => a.id === id);
  if (analysis) {
    currentAnalysis = analysis;
    showDetailedResults();
  }
}

// Feedback functions
function submitFeedback(type) {
  showToast(`Thank you for your ${type} feedback!`, 'success');
  
  // Simulate feedback submission
  setTimeout(() => {
    closeModal('results-modal');
  }, 1000);
}

function exportReport() {
  if (!currentAnalysis) {
    showToast('No analysis to export', 'error');
    return;
  }
  
  const reportData = {
    analysis: currentAnalysis,
    exportTime: new Date().toISOString(),
    version: '1.0',
    systemInfo: 'Multi-Modal Fake News Detection with Cultural Context v1.0'
  };
  
  const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fake-news-analysis-${currentAnalysis.id}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  showToast('Report exported successfully', 'success');
}

// Toast notifications
function showToast(message, type = 'info') {
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return;
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  
  toastContainer.appendChild(toast);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 3000);
}

// Load demo data
function loadDemoData() {
  // Add some demo history items
  const demoAnalyses = [
    {
      id: Date.now() - 1000,
      type: 'text',
      content: 'Breaking news article about local politics and government transparency...',
      timestamp: new Date(Date.now() - 86400000),
      results: { 
        overall_score: 75, 
        credibility: 'Credible', 
        cultural_context: 'en-US',
        flags: ['Sources verified', 'Content appears authentic'], 
        explanation: 'Content appears authentic with consistent patterns and verified sources.',
        breakdown: { text: 75, image: 70, video: 78, audio: 73, cultural: 76 }
      }
    },
    {
      id: Date.now() - 2000,
      type: 'image',
      content: 'Social media photo claiming to show protest crowd manipulation...',
      timestamp: new Date(Date.now() - 172800000),
      results: { 
        overall_score: 25, 
        credibility: 'Likely Fake', 
        cultural_context: 'en-US',
        flags: ['Digital manipulation detected', 'Inconsistent lighting'], 
        explanation: 'Image shows signs of digital manipulation including cloned crowd elements.',
        breakdown: { text: 30, image: 15, video: 20, audio: 28, cultural: 32 }
      }
    }
  ];
  
  analysisHistory.push(...demoAnalyses);
  setTimeout(() => {
    updateAnalysisHistory();
  }, 100);
}

// Utility functions
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
  // Escape key to close modals
  if (e.key === 'Escape') {
    const visibleModals = document.querySelectorAll('.modal:not(.hidden)');
    visibleModals.forEach(modal => {
      modal.classList.add('hidden');
    });
  }
  
  // Tab navigation with numbers 1-5
  if (e.key >= '1' && e.key <= '5' && !e.target.matches('input, textarea')) {
    e.preventDefault();
    const tabIndex = parseInt(e.key) - 1;
    const tabTypes = ['text', 'image', 'video', 'audio', 'combined'];
    if (tabTypes[tabIndex]) {
      switchTab(tabTypes[tabIndex]);
    }
  }
});