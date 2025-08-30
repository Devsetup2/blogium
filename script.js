document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const homeBtn = document.getElementById('homeBtn');
    const writeBtn = document.getElementById('writeBtn');
    const savedBtn = document.getElementById('savedBtn');
    const writeModal = document.getElementById('writeModal');
    const closeWriteModal = document.getElementById('closeWriteModal');
    const cancelArticle = document.getElementById('cancelArticle');
    const articleForm = document.getElementById('articleForm');
    const articlesSection = document.getElementById('articlesSection');
    const articleModal = document.getElementById('articleModal');
    const closeArticleModal = document.getElementById('closeArticleModal');
    const saveArticleBtn = document.getElementById('saveArticleBtn');
    const heroSection = document.getElementById('heroSection');

    // Modal elements
    const modalArticleTitle = document.getElementById('modalArticleTitle');
    const modalArticleDescription = document.getElementById('modalArticleDescription');
    const modalArticleImage = document.getElementById('modalArticleImage');
    const modalArticleDate = document.getElementById('modalArticleDate');
    const modalArticleTags = document.getElementById('modalArticleTags');

    // Form elements
    const articleTitle = document.getElementById('articleTitle');
    const articleDescription = document.getElementById('articleDescription');
    const articleImage = document.getElementById('articleImage');
    const articleLink = document.getElementById('articleLink');
    const articleTags = document.getElementById('articleTags');

    // State
    let currentArticleId = null;
    let savedArticles = JSON.parse(localStorage.getItem('savedArticles')) || [];
    let isViewingSaved = false;

    // Initialize
    loadArticles();
    updateNavActiveState();

    // Event Listeners
    homeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        isViewingSaved = false;
        loadArticles();
        updateNavActiveState();
    });

    writeBtn.addEventListener('click', () => {
        writeModal.classList.remove('hidden');
    });

    closeWriteModal.addEventListener('click', () => {
        writeModal.classList.add('hidden');
    });

    cancelArticle.addEventListener('click', () => {
        writeModal.classList.add('hidden');
        articleForm.reset();
    });

    articleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveArticle();
        writeModal.classList.add('hidden');
        articleForm.reset();
    });

    savedBtn.addEventListener('click', () => {
        isViewingSaved = true;
        loadSavedArticles();
        updateNavActiveState();
    });

    closeArticleModal.addEventListener('click', () => {
        articleModal.classList.add('hidden');
    });

    // Functions
    function updateNavActiveState() {
        homeBtn.classList.toggle('active-nav', !isViewingSaved);
        savedBtn.classList.toggle('active-nav', isViewingSaved);
    }

    function loadArticles() {
        heroSection.classList.remove('hidden');
        const articles = getArticles();
        displayArticles(articles);
    }

    function loadSavedArticles() {
        heroSection.classList.add('hidden');
        const allArticles = getArticles();
        const saved = allArticles.filter(article => savedArticles.includes(article.id));
        
        if (saved.length === 0) {
            articlesSection.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <i class="fas fa-bookmark text-5xl text-gray-300 mb-4"></i>
                    <h3 class="text-xl font-medium text-gray-500">Henüz kaydedilmiş yazınız yok</h3>
                </div>
            `;
            return;
        }
        
        displaySavedArticles(saved);
    }

    function getArticles() {
        const articles = JSON.parse(localStorage.getItem('articles')) || [];
        
        // If no articles, add some sample data
        if (articles.length === 0) {
            const sampleArticles = [
                {
                    id: '1',
                    title: 'Yeni Başlayanlar İçin JavaScript',
                    description: 'JavaScript öğrenmeye başlamak için temel kavramlar ve örnekler.',
                    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                    link: '#',
                    tags: ['javascript', 'programlama', 'web'],
                    date: '2023-05-15'
                },
                {
                    id: '2',
                    title: 'React Hooks Kullanım Rehberi',
                    description: 'React Hooks ile fonksiyonel bileşenlerde state yönetimi nasıl yapılır?',
                    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                    link: '#',
                    tags: ['react', 'javascript', 'frontend'],
                    date: '2023-06-20'
                },
                {
                    id: '3',
                    title: 'Tailwind CSS ile Hızlı Tasarım',
                    description: 'Tailwind CSS kullanarak modern ve responsive arayüzler nasıl oluşturulur?',
                    image: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                    link: '#',
                    tags: ['css', 'tailwind', 'tasarım'],
                    date: '2023-07-10'
                }
            ];
            localStorage.setItem('articles', JSON.stringify(sampleArticles));
            return sampleArticles;
        }
        
        return articles;
    }

    function displayArticles(articles) {
        articlesSection.innerHTML = '';
        
        if (articles.length === 0) {
            articlesSection.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <i class="fas fa-newspaper text-5xl text-gray-300 mb-4"></i>
                    <h3 class="text-xl font-medium text-gray-500">Henüz yazı bulunmamaktadır</h3>
                    <button id="writeFirstBtn" class="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                        İlk Yazınızı Yazın
                    </button>
                </div>
            `;
            
            document.getElementById('writeFirstBtn')?.addEventListener('click', () => {
                writeModal.classList.remove('hidden');
            });
            return;
        }
        
        articles.forEach(article => {
            const articleCard = document.createElement('div');
            articleCard.className = 'article-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg';
            articleCard.innerHTML = `
                <img src="${article.image}" alt="${article.title}" class="w-full h-48 object-cover">
                <div class="p-6">
                    <div class="flex flex-wrap gap-2 mb-3">
                        ${article.tags.map(tag => `
                            <span class="tag text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-700">${tag}</span>
                        `).join('')}
                    </div>
                    <h3 class="text-xl font-bold mb-2">${article.title}</h3>
                    <p class="text-gray-600 mb-4 line-clamp-2">${article.description}</p>
                    <div class="flex justify-between items-center">
                        <div class="flex items-center">
                            <i class="fas fa-user-circle text-gray-500 mr-2"></i>
                            <span class="text-sm text-gray-600">Yazar</span>
                        </div>
                        <button class="read-more-btn px-3 py-1 bg-green-100 text-green-600 rounded-md text-sm hover:bg-green-200" data-id="${article.id}">
                            Devamını Oku
                        </button>
                    </div>
                </div>
            `;
            
            articlesSection.appendChild(articleCard);
        });
        
        // Add event listeners to read more buttons
        document.querySelectorAll('.read-more-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const articleId = e.target.getAttribute('data-id');
                showArticle(articleId);
            });
        });
    }

    function displaySavedArticles(articles) {
        articlesSection.innerHTML = '';
        
        articles.forEach(article => {
            const articleCard = document.createElement('div');
            articleCard.className = 'article-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg relative';
            articleCard.innerHTML = `
                <button class="remove-saved absolute top-2 right-2 bg-white p-2 rounded-full shadow-md text-red-500 hover:bg-red-50" data-id="${article.id}" title="Kaydedilenlerden kaldır">
                    <i class="fas fa-times"></i>
                </button>
                <img src="${article.image}" alt="${article.title}" class="w-full h-48 object-cover">
                <div class="p-6">
                    <div class="flex flex-wrap gap-2 mb-3">
                        ${article.tags.map(tag => `
                            <span class="tag text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-700">${tag}</span>
                        `).join('')}
                    </div>
                    <h3 class="text-xl font-bold mb-2">${article.title}</h3>
                    <p class="text-gray-600 mb-4 line-clamp-2">${article.description}</p>
                    <div class="flex justify-between items-center">
                        <div class="flex items-center">
                            <i class="fas fa-user-circle text-gray-500 mr-2"></i>
                            <span class="text-sm text-gray-600">Yazar</span>
                        </div>
                        <button class="read-more-btn px-3 py-1 bg-green-100 text-green-600 rounded-md text-sm hover:bg-green-200" data-id="${article.id}">
                            Devamını Oku
                        </button>
                    </div>
                </div>
            `;
            
            articlesSection.appendChild(articleCard);
        });
        
        // Add event listeners to read more buttons
        document.querySelectorAll('.read-more-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const articleId = e.target.getAttribute('data-id');
                showArticle(articleId);
            });
        });
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-saved').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const articleId = e.target.closest('button').getAttribute('data-id');
                removeFromSaved(articleId);
            });
        });
    }

    function showArticle(articleId) {
        const articles = getArticles();
        const article = articles.find(a => a.id === articleId);
        
        if (!article) return;
        
        currentArticleId = articleId;
        
        // Update modal content
        modalArticleTitle.textContent = article.title;
        modalArticleDescription.textContent = article.description;
        modalArticleImage.src = article.image;
        modalArticleDate.textContent = formatDate(article.date);
        
        // Update tags
        modalArticleTags.innerHTML = '';
        article.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'tag text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-700 mr-2 mb-2';
            tagElement.textContent = tag;
            modalArticleTags.appendChild(tagElement);
        });
        
        // Update save button
        updateSaveButton();
        
        // Show modal
        articleModal.classList.remove('hidden');
    }

    function updateSaveButton() {
        if (savedArticles.includes(currentArticleId)) {
            saveArticleBtn.innerHTML = '<i class="fas fa-bookmark"></i>';
            saveArticleBtn.title = 'Kaydedilenlerden çıkar';
        } else {
            saveArticleBtn.innerHTML = '<i class="far fa-bookmark"></i>';
            saveArticleBtn.title = 'Kaydet';
        }
    }

    function saveArticle() {
        const articles = getArticles();
        const newArticle = {
            id: Date.now().toString(),
            title: articleTitle.value,
            description: articleDescription.value,
            image: articleImage.value || 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            link: articleLink.value || '#',
            tags: articleTags.value.split(',').map(tag => tag.trim()),
            date: new Date().toISOString().split('T')[0]
        };
        
        articles.unshift(newArticle);
        localStorage.setItem('articles', JSON.stringify(articles));
        loadArticles();
    }

    function removeFromSaved(articleId) {
        const index = savedArticles.indexOf(articleId);
        if (index !== -1) {
            savedArticles.splice(index, 1);
            localStorage.setItem('savedArticles', JSON.stringify(savedArticles));
            
            if (isViewingSaved) {
                loadSavedArticles();
            }
            
            if (currentArticleId === articleId) {
                updateSaveButton();
            }
        }
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('tr-TR', options);
    }

    // Save article to saved list
    saveArticleBtn.addEventListener('click', () => {
        if (!currentArticleId) return;
        
        const index = savedArticles.indexOf(currentArticleId);
        if (index === -1) {
            savedArticles.push(currentArticleId);
        } else {
            savedArticles.splice(index, 1);
        }
        
        localStorage.setItem('savedArticles', JSON.stringify(savedArticles));
        updateSaveButton();
        
        if (isViewingSaved && index !== -1) {
            // If we removed from saved while viewing saved articles, reload the list
            loadSavedArticles();
        }
    });
});
