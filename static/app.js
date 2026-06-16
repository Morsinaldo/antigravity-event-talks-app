document.addEventListener('DOMContentLoaded', () => {
    // Application State
    let allReleases = [];      // Raw releases parsed from server
    let selectedUpdate = null; // Currently selected sub-item update
    let activeCategory = 'all';// Currently active category filter
    let searchQuery = '';      // Active search query
    let lastUpdatedTime = null;// Timestamp of the last successful fetch

    // DOM Elements
    const timelineContainer = document.getElementById('timeline-container');
    const loadingSpinner = document.getElementById('loading-spinner');
    const emptyStateView = document.getElementById('empty-state-view');
    const searchInput = document.getElementById('search-input');
    const refreshButton = document.getElementById('refresh-button');
    const exportCsvButton = document.getElementById('export-csv-button');
    const resultsCountDisplay = document.getElementById('results-count-display');
    const lastUpdatedDisplay = document.getElementById('last-updated-display');
    const categoryFiltersContainer = document.getElementById('category-filters-container');
    const resetFiltersBtn = document.getElementById('reset-filters-btn');
    
    // Composer Elements
    const tweetTextarea = document.getElementById('tweet-textarea');
    const btnShareTweet = document.getElementById('btn-share-tweet');
    const charCountDisplay = document.getElementById('char-count-display');
    const charProgressRing = document.getElementById('char-progress-ring');
    const selectedSourceBanner = document.getElementById('selected-source-banner');
    const sourceBadge = document.getElementById('source-badge');
    const sourceDate = document.getElementById('source-date');
    const clearSelectionBtn = document.getElementById('clear-selection-btn');
    
    // Live Preview Elements
    const mockTweetText = document.getElementById('mock-tweet-text');
    const mockTweetTime = document.getElementById('mock-tweet-time');

    // Progress Ring Setup
    const ringRadius = charProgressRing.r.baseVal.value;
    const ringCircumference = ringRadius * 2 * Math.PI;
    charProgressRing.style.strokeDasharray = `${ringCircumference} ${ringCircumference}`;
    charProgressRing.style.strokeDashoffset = ringCircumference;

    // Helper functions
    function formatTime(date) {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        const strTime = hours + ':' + minutes + ' ' + ampm;
        
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${strTime} · ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }

    function updateLastUpdatedText() {
        if (!lastUpdatedTime) {
            lastUpdatedDisplay.textContent = 'Last updated: Never';
            return;
        }
        const diffSecs = Math.floor((Date.now() - lastUpdatedTime) / 1000);
        if (diffSecs < 5) {
            lastUpdatedDisplay.textContent = 'Last updated: Just now';
        } else if (diffSecs < 60) {
            lastUpdatedDisplay.textContent = `Last updated: ${diffSecs}s ago`;
        } else {
            const diffMins = Math.floor(diffSecs / 60);
            lastUpdatedDisplay.textContent = `Last updated: ${diffMins}m ago`;
        }
    }

    // Update the visual representation of the progress ring and character count text
    function updateCharCount() {
        const textLength = tweetTextarea.value.length;
        const maxLength = 280;
        const remaining = maxLength - textLength;
        
        charCountDisplay.textContent = remaining;
        
        // Progress percentage
        const percent = Math.min((textLength / maxLength) * 100, 100);
        const offset = ringCircumference - (percent / 100) * ringCircumference;
        charProgressRing.style.strokeDashoffset = offset;
        
        // Dynamic color styles
        if (remaining <= 20 && remaining > 0) {
            charCountDisplay.className = 'char-count-text warning';
            charProgressRing.style.stroke = 'var(--color-bq-orange)';
        } else if (remaining <= 0) {
            charCountDisplay.className = 'char-count-text danger';
            charProgressRing.style.stroke = 'var(--color-issue)';
        } else {
            charCountDisplay.className = 'char-count-text';
            charProgressRing.style.stroke = 'var(--color-x-blue)';
        }
        
        // Enable or disable the Tweet button
        btnShareTweet.disabled = (textLength === 0 || remaining < 0);
        
        // Update live preview
        updateLivePreview(tweetTextarea.value);
    }

    // Format hashtags and links for the live preview body
    function updateLivePreview(text) {
        if (!text || text.trim() === '') {
            mockTweetText.innerHTML = '<span style="color: var(--text-muted)">Select an update above to draft a tweet. You can edit the text before posting.</span>';
            return;
        }
        
        // Escape HTML to prevent XSS in mock tweet preview
        let safeText = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
            
        // Highlight hashtags
        safeText = safeText.replace(/(^|\s)(#[a-zA-Z\d_]+)/g, '$1<span class="hashtag">$2</span>');
        
        // Highlight URLs
        safeText = safeText.replace(/(https?:\/\/[^\s]+)/g, '<span class="hashtag">$1</span>');
        
        mockTweetText.innerHTML = safeText;
    }

    // Load releases from backend
    async function loadReleases(forceRefresh = false) {
        // Visual indicator
        document.querySelector('.connection-status .status-dot').className = 'status-dot loading';
        document.getElementById('status-text').textContent = 'Syncing...';
        refreshButton.classList.add('spinning');
        
        if (forceRefresh) {
            loadingSpinner.classList.remove('hidden');
            timelineContainer.innerHTML = '';
            emptyStateView.classList.add('hidden');
        }

        try {
            const response = await fetch(`/api/releases?refresh=${forceRefresh}`);
            const data = await response.json();
            
            if (data.success) {
                allReleases = data.releases;
                lastUpdatedTime = new Date(data.last_updated * 1000);
                updateLastUpdatedText();
                renderTimeline();
                
                document.querySelector('.connection-status .status-dot').className = 'status-dot online';
                document.getElementById('status-text').textContent = 'Connected';
            } else {
                console.error("Server error loading releases:", data.error);
                showNotification("Failed to fetch release notes: " + data.error);
            }
        } catch (error) {
            console.error("Network error loading releases:", error);
            showNotification("Network error. Please check your server connection.");
        } finally {
            loadingSpinner.classList.add('hidden');
            refreshButton.classList.remove('spinning');
            document.querySelector('.connection-status .status-dot').className = 'status-dot online';
            document.getElementById('status-text').textContent = 'Connected';
        }
    }

    // Render timeline based on filters
    function renderTimeline() {
        timelineContainer.innerHTML = '';
        
        let totalItemsRendered = 0;
        
        allReleases.forEach(entry => {
            // Filter sub_items in this entry
            const filteredSubItems = entry.sub_items.filter(item => {
                // Category filter
                const matchesCategory = (activeCategory === 'all') || 
                                       (item.type.toLowerCase().includes(activeCategory));
                
                // Search filter (searches title, type, plain text content, and HTML)
                const searchLower = searchQuery.toLowerCase();
                const matchesSearch = (searchQuery === '') || 
                                     entry.title.toLowerCase().includes(searchLower) ||
                                     item.type.toLowerCase().includes(searchLower) ||
                                     item.text.toLowerCase().includes(searchLower);
                                     
                return matchesCategory && matchesSearch;
            });
            
            if (filteredSubItems.length > 0) {
                totalItemsRendered += filteredSubItems.length;
                
                // Create date group element
                const dateGroup = document.createElement('div');
                dateGroup.className = 'timeline-date-group';
                
                // Timeline dot
                const dot = document.createElement('div');
                dot.className = 'timeline-dot';
                dateGroup.appendChild(dot);
                
                // Header details
                const header = document.createElement('div');
                header.className = 'timeline-date-header';
                
                const dateTitle = document.createElement('h3');
                dateTitle.className = 'timeline-date-title';
                dateTitle.textContent = entry.title;
                header.appendChild(dateTitle);
                
                if (entry.link) {
                    const link = document.createElement('a');
                    link.className = 'timeline-date-link';
                    link.href = entry.link;
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    link.innerHTML = `
                        <span>Official Notes</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    `;
                    header.appendChild(link);
                }
                
                dateGroup.appendChild(header);
                
                // Cards container
                const cardsWrapper = document.createElement('div');
                cardsWrapper.className = 'timeline-items-wrapper';
                
                filteredSubItems.forEach(item => {
                    const isSelected = selectedUpdate && 
                                       selectedUpdate.text === item.text && 
                                       selectedUpdate.entry_title === item.entry_title;
                                       
                    const card = document.createElement('div');
                    card.className = `update-item-card${isSelected ? ' selected' : ''}`;
                    
                    card.innerHTML = `
                        <div class="update-card-header">
                            <span class="badge ${item.badge_class}">${item.type}</span>
                            <div class="card-header-actions">
                                <button class="card-action-btn btn-copy-card" title="Copy text to clipboard">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                    <span>Copy</span>
                                </button>
                                <div class="tweet-select-indicator">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                    </svg>
                                    <span>Select</span>
                                </div>
                            </div>
                        </div>
                        <div class="update-card-content">
                            ${item.html}
                        </div>
                    `;
                    
                    // Copy card content to clipboard listener
                    const copyBtn = card.querySelector('.btn-copy-card');
                    copyBtn.addEventListener('click', (e) => {
                        e.stopPropagation(); // Prevent card selection click
                        navigator.clipboard.writeText(item.text).then(() => {
                            const btnSpan = copyBtn.querySelector('span');
                            const originalText = btnSpan.textContent;
                            btnSpan.textContent = 'Copied!';
                            copyBtn.classList.add('copied');
                            setTimeout(() => {
                                btnSpan.textContent = originalText;
                                copyBtn.classList.remove('copied');
                            }, 2000);
                        }).catch(err => {
                            console.error('Failed to copy text: ', err);
                            showNotification('Failed to copy to clipboard.');
                        });
                    });

                    // Click event to select update for draft
                    card.addEventListener('click', (e) => {
                        // Prevent selection if they click an actual link in the card or the copy button
                        if (e.target.tagName === 'A' || e.target.closest('.btn-copy-card')) return;
                        
                        selectUpdate(item, card);
                    });
                    
                    cardsWrapper.appendChild(card);
                });
                
                dateGroup.appendChild(cardsWrapper);
                timelineContainer.appendChild(dateGroup);
            }
        });
        
        resultsCountDisplay.textContent = `Showing ${totalItemsRendered} update${totalItemsRendered === 1 ? '' : 's'}`;
        
        if (totalItemsRendered === 0) {
            emptyStateView.classList.remove('hidden');
        } else {
            emptyStateView.classList.add('hidden');
        }
    }

    // Select an update to draft to Twitter
    function selectUpdate(item, cardElement) {
        // Toggle off if clicking selected item
        if (selectedUpdate && selectedUpdate.text === item.text && selectedUpdate.entry_title === item.entry_title) {
            clearSelection();
            return;
        }

        selectedUpdate = item;
        
        // Toggle selected styling classes
        document.querySelectorAll('.update-item-card').forEach(el => el.classList.remove('selected'));
        if (cardElement) {
            cardElement.classList.add('selected');
        }
        
        // Show banner details
        sourceBadge.textContent = item.type;
        sourceBadge.className = `badge ${item.badge_class}`;
        sourceDate.textContent = item.entry_title;
        selectedSourceBanner.classList.add('active');
        clearSelectionBtn.classList.remove('hidden');
        
        // Draft Tweet text content
        // Clean up text double spaces, newlines, limit size and add tags
        const formattedDate = item.entry_title;
        const cleanContent = item.text.replace(/\s+/g, ' ').substring(0, 160).trim();
        const suffix = `... details: ${item.entry_link || ''}`;
        
        // Draft: "BigQuery Update [Feature] (June 15): [Brief Details]... #BigQuery"
        let draftText = `BigQuery Update [${item.type}] (${formattedDate}):\n${cleanContent}`;
        if (draftText.length + suffix.length > 250) {
            // Trim content a bit more
            const allowedLen = 250 - suffix.length - `BigQuery Update [${item.type}] (${formattedDate}):\n`.length;
            draftText = `BigQuery Update [${item.type}] (${formattedDate}):\n${cleanContent.substring(0, allowedLen)}...`;
        } else {
            draftText += `...`;
        }
        
        draftText += `\nRead more: ${item.entry_link}\n#BigQuery`;
        
        tweetTextarea.value = draftText;
        updateCharCount();
        
        // Smooth scroll composer into view on mobile
        if (window.innerWidth <= 1100) {
            document.querySelector('.composer-section').scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Clear current selection
    function clearSelection() {
        selectedUpdate = null;
        document.querySelectorAll('.update-item-card').forEach(el => el.classList.remove('selected'));
        
        sourceBadge.textContent = 'None';
        sourceBadge.className = 'badge';
        sourceDate.textContent = 'Select an update from the timeline';
        selectedSourceBanner.classList.remove('active');
        clearSelectionBtn.classList.add('hidden');
        
        tweetTextarea.value = '';
        updateCharCount();
    }

    // Add Tag helpers click listeners
    document.querySelectorAll('.tag-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const tag = chip.getAttribute('data-tag');
            const currentText = tweetTextarea.value;
            
            // Check if tag already exists in textarea
            if (currentText.includes(tag)) {
                return;
            }
            
            // Append with proper space spacing
            if (currentText.trim() === '') {
                tweetTextarea.value = tag;
            } else if (currentText.endsWith(' ') || currentText.endsWith('\n')) {
                tweetTextarea.value = currentText + tag;
            } else {
                tweetTextarea.value = currentText + ' ' + tag;
            }
            
            updateCharCount();
            tweetTextarea.focus();
        });
    });

    // Share Tweet via Web Intent
    btnShareTweet.addEventListener('click', () => {
        const text = tweetTextarea.value;
        if (!text || text.trim() === '') return;
        
        const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(twitterIntentUrl, '_blank', 'noopener,noreferrer');
    });

    // Real-time Textarea Events
    tweetTextarea.addEventListener('input', updateCharCount);

    // Refresh Button Click
    refreshButton.addEventListener('click', () => {
        loadReleases(true);
    });

    // Search input
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderTimeline();
    });

    // Reset Filters
    resetFiltersBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        activeCategory = 'all';
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-category') === 'all');
        });
        renderTimeline();
    });

    // Category button filters
    categoryFiltersContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        activeCategory = btn.getAttribute('data-category');
        renderTimeline();
    });

    // Clear Selection Button Click
    clearSelectionBtn.addEventListener('click', clearSelection);

    // Export to CSV Button Click
    exportCsvButton.addEventListener('click', exportToCSV);

    function exportToCSV() {
        const exportData = [];
        allReleases.forEach(entry => {
            entry.sub_items.forEach(item => {
                const matchesCategory = (activeCategory === 'all') || 
                                       (item.type.toLowerCase().includes(activeCategory));
                const searchLower = searchQuery.toLowerCase();
                const matchesSearch = (searchQuery === '') || 
                                     entry.title.toLowerCase().includes(searchLower) ||
                                     item.type.toLowerCase().includes(searchLower) ||
                                     item.text.toLowerCase().includes(searchLower);
                                     
                if (matchesCategory && matchesSearch) {
                    exportData.push({
                        date: entry.title,
                        type: item.type,
                        text: item.text,
                        link: item.entry_link
                    });
                }
            });
        });
        
        if (exportData.length === 0) {
            showNotification('No data to export!');
            return;
        }
        
        const escapeCSV = (text) => {
            if (text === null || text === undefined) return '';
            let val = text.toString();
            val = val.replace(/"/g, '""');
            if (val.includes(',') || val.includes('"') || val.includes('\n') || val.includes('\r')) {
                return `"${val}"`;
            }
            return val;
        };
        
        const headers = ['Date', 'Type', 'Description', 'Link'];
        const csvRows = [headers.join(',')];
        
        exportData.forEach(row => {
            const values = [
                escapeCSV(row.date),
                escapeCSV(row.type),
                escapeCSV(row.text),
                escapeCSV(row.link)
            ];
            csvRows.push(values.join(','));
        });
        
        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `bigquery_release_notes_${activeCategory}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showNotification(`Exported ${exportData.length} records to CSV!`);
    }

    // Toast/Status Notification Helper
    function showNotification(message) {
        // Create quick temporary alert banner at the bottom
        const banner = document.createElement('div');
        banner.style.position = 'fixed';
        banner.style.bottom = '24px';
        banner.style.right = '24px';
        banner.style.backgroundColor = 'var(--bg-sidebar)';
        banner.style.border = '1px solid var(--color-bq-orange)';
        banner.style.color = '#fff';
        banner.style.padding = '12px 20px';
        banner.style.borderRadius = '8px';
        banner.style.boxShadow = 'var(--shadow-lg)';
        banner.style.zIndex = '1000';
        banner.style.fontSize = '0.85rem';
        banner.style.display = 'flex';
        banner.style.alignItems = 'center';
        banner.style.gap = '8px';
        banner.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        banner.innerHTML = `
            <span style="color: var(--color-bq-orange)">●</span>
            <span>${message}</span>
        `;
        
        document.body.appendChild(banner);
        
        setTimeout(() => {
            banner.style.opacity = '0';
            banner.style.transform = 'translateY(10px)';
            setTimeout(() => banner.remove(), 300);
        }, 4000);
    }

    // Set Live preview timestamp dynamically
    mockTweetTime.textContent = formatTime(new Date());

    // Periodically update the "last updated" visual string
    setInterval(updateLastUpdatedText, 15000);

    // Theme Switcher Logic
    const themeToggleCheckbox = document.getElementById('theme-toggle-checkbox');
    
    // Check local storage for theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeToggleCheckbox.checked = true;
    } else {
        document.body.classList.remove('light-theme');
        themeToggleCheckbox.checked = false;
    }

    themeToggleCheckbox.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.remove('light-theme');
            localStorage.setItem('theme', 'dark');
        }
    });

    // Initial Load
    loadReleases(false);
});
