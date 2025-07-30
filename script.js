// IA'S TOP - Interactive 3D Web Application
// Main JavaScript functionality

class IAWebApp {
    constructor() {
        this.currentCategory = 'general';
        this.isAnimating = false;
        this.particlesArray = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createParticles();
        this.initializeAnimations();
        this.loadAIData();
        this.startParticleAnimation();
    }

    setupEventListeners() {
        // Navigation buttons
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.switchCategory(category);
                this.rotateCubeToFace(category);
            });
        });

        // AI Cards click events
        document.addEventListener('click', (e) => {
            if (e.target.closest('.ai-card')) {
                const card = e.target.closest('.ai-card');
                this.showAIDetails(card.dataset.ai);
            }
        });

        // Close details panel
        const closeBtn = document.getElementById('closeDetails');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeDetailsPanel();
            });
        }

        // Cube click interaction
        const cube = document.getElementById('mainCube');
        if (cube) {
            cube.addEventListener('click', () => {
                this.addCubeEffect();
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyNavigation(e);
        });

        // Mouse movement parallax effect
        document.addEventListener('mousemove', (e) => {
            this.handleMouseParallax(e);
        });

        // Scroll effects
        window.addEventListener('scroll', () => {
            this.handleScrollEffects();
        });
    }

    switchCategory(category) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.currentCategory = category;

        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');

        // Switch content sections
        document.querySelectorAll('.category-section').forEach(section => {
            section.classList.remove('active');
        });

        setTimeout(() => {
            document.querySelector(`section[data-category="${category}"]`).classList.add('active');
            this.isAnimating = false;
        }, 300);
    }

    rotateCubeToFace(category) {
        const cube = document.getElementById('mainCube');
        const rotations = {
            'general': 'rotateX(0deg) rotateY(0deg)',
            'imagenes': 'rotateX(0deg) rotateY(180deg)',
            'videos': 'rotateX(0deg) rotateY(90deg)',
            'programacion': 'rotateX(0deg) rotateY(-90deg)',
            'organizacion': 'rotateX(-90deg) rotateY(0deg)',
            'chatbots': 'rotateX(90deg) rotateY(0deg)',
            'directorios': 'rotateX(0deg) rotateY(45deg)',
            'audio': 'rotateX(45deg) rotateY(45deg)',
            'utilidades': 'rotateX(-45deg) rotateY(45deg)',
            'web': 'rotateX(45deg) rotateY(-45deg)',
            'sistemas': 'rotateX(30deg) rotateY(60deg)',
            'educacion': 'rotateX(-30deg) rotateY(-60deg)',
            'extra': 'rotateX(60deg) rotateY(30deg)'
        };

        if (cube && rotations[category]) {
            cube.style.animation = 'none';
            cube.style.transform = rotations[category];
            
            setTimeout(() => {
                cube.style.animation = 'rotate3D 20s linear infinite';
            }, 2000);
        }
    }

    showAIDetails(aiId) {
        const aiData = this.getAIData(aiId);
        if (!aiData) return;

        const detailsPanel = document.getElementById('detailsPanel');
        const detailsContent = document.getElementById('detailsContent');
        
        detailsContent.innerHTML = this.generateDetailsHTML(aiData);
        detailsPanel.classList.add('active');
    }

    closeDetailsPanel() {
        const detailsPanel = document.getElementById('detailsPanel');
        detailsPanel.classList.remove('active');
    }

    generateDetailsHTML(aiData) {
        return `
            <div class="ai-details">
                <h2>${aiData.name}</h2>
                <div class="ai-category">${aiData.category}</div>
                <div class="ai-description">
                    <h3>Descripción</h3>
                    <p>${aiData.description}</p>
                </div>
                <div class="ai-features">
                    <h3>Características</h3>
                    <ul>
                        ${aiData.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                <div class="ai-pricing">
                    <h3>Precio</h3>
                    <span class="price-tag ${aiData.pricing.type}">${aiData.pricing.label}</span>
                </div>
                ${aiData.url ? `<div class="ai-link">
                    <a href="${aiData.url}" target="_blank" class="visit-btn">Visitar Sitio Web</a>
                </div>` : ''}
                <div class="ai-rating">
                    <h3>Valoración</h3>
                    <div class="stars">
                        ${this.generateStars(aiData.rating)}
                    </div>
                </div>
            </div>
        `;
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let starsHTML = '';
        
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '⭐';
        }
        if (hasHalfStar) {
            starsHTML += '⭐';
        }
        
        return starsHTML;
    }

    getAIData(aiId) {
        const aiDatabase = {
            // Generales
            'claude': {
                name: 'Claude Sonnet 4',
                category: 'Inteligencias Artificiales Generales',
                description: 'IA avanzada para programación y preguntas complejas. Nuevo modelo con capacidades mejoradas.',
                features: ['Programación avanzada', 'Análisis de código', 'Resolución de problemas complejos', 'Múltiples lenguajes de programación'],
                pricing: { type: 'premium', label: 'Premium' },
                rating: 4.8,
                url: 'https://claude.ai'
            },
            'deepsite': {
                name: 'DeepSite',
                category: 'Desarrollo Web',
                description: 'Construye la web que le pidas mientras ves su creación y puedes obtener el código.',
                features: ['Creación de sitios web en tiempo real', 'Visualización del proceso', 'Exportación de código', 'Diseño automático'],
                pricing: { type: 'free', label: 'Gratis' },
                rating: 4.5
            },
            'grok': {
                name: 'Grok',
                category: 'Inteligencias Artificiales Generales',
                description: 'Última y mejor IA actual con capacidades avanzadas.',
                features: ['Conversación natural', 'Análisis de datos', 'Respuestas en tiempo real', 'Información actualizada'],
                pricing: { type: 'premium', label: 'Premium' },
                rating: 4.9
            },
            'meta-ai': {
                name: 'META AI',
                category: 'Inteligencias Artificiales Generales',
                description: 'IA MAS POTENTE DE TEXTO desarrollada por Meta.',
                features: ['Procesamiento de texto avanzado', 'Conversación natural', 'Múltiples idiomas', 'Integración social'],
                pricing: { type: 'free', label: 'Gratis' },
                rating: 4.7
            },
            'genspark': {
                name: 'Genspark.ai',
                category: 'Plataforma Completa',
                description: 'La plataforma más completa con agentes de IA, deep research, código in live, modelos de imágenes y video.',
                features: ['Agentes de IA', 'Deep research', 'Código en vivo', 'Modelos de imágenes y video'],
                pricing: { type: 'premium', label: 'Premium' },
                rating: 4.8
            },
            
            // Imágenes
            'gamma': {
                name: 'GAMMA',
                category: 'Generación de Contenido',
                description: 'IA completa que hace páginas web, presentaciones y todo tipo de contenido.',
                features: ['Creación de presentaciones', 'Diseño web automático', 'Plantillas profesionales', 'Exportación múltiple'],
                pricing: { type: 'premium', label: 'Premium' },
                rating: 4.7
            },
            'flux-playground': {
                name: 'Flux Playground',
                category: 'Generación de Imágenes',
                description: 'La más avanzada transformando fotos e imágenes.',
                features: ['Transformación de imágenes', 'Edición avanzada', 'Múltiples estilos', 'Alta calidad'],
                pricing: { type: 'free', label: 'Gratis' },
                rating: 4.6
            },
            'freepik': {
                name: 'Freepik.com',
                category: 'Generación de Imágenes',
                description: 'Generador de imágenes profesional con modelos gratuitos y pagos.',
                features: ['Modelos gratuitos y premium', 'Calidad profesional', 'Múltiples estilos', 'Exportación en alta resolución'],
                pricing: { type: 'freemium', label: 'Freemium' },
                rating: 4.5
            },
            'blinkshot': {
                name: 'Blinkshot.io',
                category: 'Generación de Imágenes',
                description: 'CREA IMAGENES DE FORMA ILIMITADA CON UNA API.',
                features: ['API ilimitada', 'Generación rápida', 'Múltiples formatos', 'Integración fácil'],
                pricing: { type: 'premium', label: 'Premium' },
                rating: 4.4,
                url: 'https://blinkshot.io/'
            },

            // Videos
            'pika-video': {
                name: 'PIKA.ART',
                category: 'Generación de Videos',
                description: 'CREA VIDEOS COM IMAGENES.',
                features: ['Videos desde imágenes', 'Alta calidad', 'Edición automática', 'Múltiples formatos'],
                pricing: { type: 'premium', label: 'Premium' },
                rating: 4.6
            },
            'hailuo': {
                name: 'Hailuo.ai',
                category: 'Generación de Videos',
                description: 'Videos como veo 3, 25 créditos diarios.',
                features: ['25 créditos diarios', 'Calidad Veo 3', 'Generación rápida', 'Fácil de usar'],
                pricing: { type: 'free', label: 'Gratis' },
                rating: 4.3
            },
            'hedra': {
                name: 'Hedra',
                category: 'Generación de Videos',
                description: 'Crea videos de avatares con el modelo character 3.',
                features: ['Avatares realistas', 'Modelo Character 3', 'Animación facial', 'Personalización avanzada'],
                pricing: { type: 'premium', label: 'Premium' },
                rating: 4.5
            },

            // Programación
            'bolt': {
                name: 'Bolt.new',
                category: 'Programación',
                description: 'IA para programar (juegos).',
                features: ['Desarrollo de juegos', 'Código automático', 'Múltiples lenguajes', 'Integración IDE'],
                pricing: { type: 'free', label: 'Gratis' },
                rating: 4.4
            },
            'v0': {
                name: 'V0.dev AI',
                category: 'Programación',
                description: 'Desarrolla cualquier idea todo el código y la interfaces de la app.',
                features: ['Código completo', 'Interfaces automáticas', 'Múltiples frameworks', 'Deploy automático'],
                pricing: { type: 'premium', label: 'Premium' },
                rating: 4.7
            },
            'blackbox': {
                name: 'Blackbox.ai',
                category: 'Programación',
                description: 'Construye páginas web muy eficientes.',
                features: ['Páginas web eficientes', 'Optimización automática', 'SEO integrado', 'Responsive design'],
                pricing: { type: 'free', label: 'Gratis' },
                rating: 4.3
            },

            // Audio
            'fish': {
                name: 'Fish.audio',
                category: 'Audio y Voz',
                description: 'Click en build voice y clona tu voz.',
                features: ['Clonación de voz', 'Alta fidelidad', 'Múltiples idiomas', 'API disponible'],
                pricing: { type: 'free', label: 'Gratis' },
                rating: 4.5
            },
            'character': {
                name: 'Character.AI',
                category: 'Audio y Voz',
                description: 'Clonar tu voz.',
                features: ['Clonación de voz', 'Personajes AI', 'Conversación natural', 'Personalización'],
                pricing: { type: 'freemium', label: 'Freemium' },
                rating: 4.4
            },

            // Organización
            'numerous': {
                name: 'Numerous.ai',
                category: 'Organización',
                description: 'Excel con IA integrada.',
                features: ['Excel con IA', 'Automatización', 'Análisis inteligente', 'Fórmulas automáticas'],
                pricing: { type: 'premium', label: 'Premium' },
                rating: 4.6
            },
            'notebooklm': {
                name: 'NotebookLM',
                category: 'Organización',
                description: 'Hace podcast de PDF.',
                features: ['PDF a podcast', 'Síntesis de voz', 'Resúmenes automáticos', 'Múltiples formatos'],
                pricing: { type: 'free', label: 'Gratis' },
                rating: 4.7
            },

            // Web
            'landingsite': {
                name: 'LandingSite.ai',
                category: 'Desarrollo Web',
                description: 'Te hace la web que le describas.',
                features: ['Descripción a web', 'Diseño automático', 'Responsive', 'SEO optimizado'],
                pricing: { type: 'premium', label: 'Premium' },
                rating: 4.5
            },
            'readdy': {
                name: 'Readdy.ai',
                category: 'Desarrollo Web',
                description: 'Crea una página web, puedes publicarla al instante editarla y extraer el código HTML.',
                features: ['Publicación instantánea', 'Editor integrado', 'Extracción de código', 'Hosting incluido'],
                pricing: { type: 'freemium', label: 'Freemium' },
                rating: 4.4
            }
        };

        return aiDatabase[aiId] || {
            name: 'Herramienta IA',
            category: 'General',
            description: 'Información no disponible',
            features: ['Funcionalidad básica'],
            pricing: { type: 'unknown', label: 'Consultar' },
            rating: 4.0
        };
    }

    createParticles() {
        const particlesContainer = document.getElementById('particles');
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 4 + 2;
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const opacity = Math.random() * 0.5 + 0.3;
            
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.opacity = opacity;
            particle.style.animationDelay = Math.random() * 6 + 's';
            
            particlesContainer.appendChild(particle);
            this.particlesArray.push({
                element: particle,
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5
            });
        }
    }

    startParticleAnimation() {
        const animateParticles = () => {
            this.particlesArray.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                if (particle.x < 0 || particle.x > window.innerWidth) {
                    particle.vx *= -1;
                }
                if (particle.y < 0 || particle.y > window.innerHeight) {
                    particle.vy *= -1;
                }
                
                particle.element.style.left = particle.x + 'px';
                particle.element.style.top = particle.y + 'px';
            });
            
            requestAnimationFrame(animateParticles);
        };
        
        animateParticles();
    }

    addCubeEffect() {
        const cube = document.getElementById('mainCube');
        cube.classList.add('pulse');
        
        setTimeout(() => {
            cube.classList.remove('pulse');
        }, 2000);
    }

    handleKeyNavigation(e) {
        const categories = ['general', 'imagenes', 'videos', 'programacion', 'organizacion', 'chatbots', 'directorios', 'audio', 'utilidades', 'web', 'sistemas', 'educacion', 'extra'];
        const currentIndex = categories.indexOf(this.currentCategory);
        
        switch(e.code) {
            case 'ArrowRight':
                const nextIndex = (currentIndex + 1) % categories.length;
                this.switchCategory(categories[nextIndex]);
                this.rotateCubeToFace(categories[nextIndex]);
                break;
            case 'ArrowLeft':
                const prevIndex = (currentIndex - 1 + categories.length) % categories.length;
                this.switchCategory(categories[prevIndex]);
                this.rotateCubeToFace(categories[prevIndex]);
                break;
            case 'Escape':
                this.closeDetailsPanel();
                break;
        }
    }

    handleMouseParallax(e) {
        const cube = document.getElementById('mainCube');
        if (!cube) return;
        
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = (e.clientY / window.innerHeight) * 2 - 1;
        
        const rotateX = y * 10;
        const rotateY = x * 10;
        
        cube.style.transform += ` rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }

    handleScrollEffects() {
        // Simplified scroll effects - removed parallax that was causing issues
        const scrollY = window.scrollY;
        const cube = document.getElementById('mainCube');
        
        // Only rotate cube slightly with scroll, but keep it fixed in position
        if (cube) {
            const rotateSpeed = scrollY * 0.05;
            const currentTransform = cube.style.transform || '';
            if (!currentTransform.includes('rotateX') || !currentTransform.includes('rotateY')) {
                cube.style.transform = `rotateX(${rotateSpeed}deg) rotateY(${rotateSpeed}deg)`;
            }
        }
        
        // Removed card parallax effect to fix scrolling issues
    }

    initializeAnimations() {
        // Intersection Observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });

        // Observe all cards
        document.querySelectorAll('.ai-card').forEach(card => {
            observer.observe(card);
        });
    }

    loadAIData() {
        // Simulate loading effect
        const cards = document.querySelectorAll('.ai-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('loading');
                setTimeout(() => {
                    card.classList.remove('loading');
                }, 1000);
            }, index * 100);
        });
    }

    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Advanced 3D Effects Class
class Advanced3DEffects {
    constructor() {
        this.initWebGL();
        this.setupShaders();
    }

    initWebGL() {
        // WebGL setup for advanced 3D effects (simplified)
        const canvas = document.createElement('canvas');
        canvas.id = 'webgl-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '-2';
        document.body.appendChild(canvas);
    }

    setupShaders() {
        // Shader setup would go here for advanced effects
        console.log('Advanced 3D effects initialized');
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.fps = 0;
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.monitor();
    }

    monitor() {
        const now = performance.now();
        this.frameCount++;
        
        if (now >= this.lastTime + 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (now - this.lastTime));
            this.frameCount = 0;
            this.lastTime = now;
            
            // Adjust quality based on performance
            this.adjustQuality();
        }
        
        requestAnimationFrame(() => this.monitor());
    }

    adjustQuality() {
        if (this.fps < 30) {
            // Reduce particle count or disable heavy animations
            document.body.classList.add('low-performance');
        } else {
            document.body.classList.remove('low-performance');
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const app = new IAWebApp();
    const effects = new Advanced3DEffects();
    const monitor = new PerformanceMonitor();
    
    // Global error handling
    window.addEventListener('error', (e) => {
        console.error('Error in IA Web App:', e);
    });
    
    // Service Worker registration for offline functionality
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered:', registration))
            .catch(error => console.log('SW registration failed:', error));
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { IAWebApp, Advanced3DEffects, PerformanceMonitor };
}