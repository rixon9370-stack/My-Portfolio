/**
 * ==========================================================================
 * RIXON SUNNY — CLIENT-FOCUSED CINEMATIC JAVASCRIPT ENGINE
 * Timeline Opening Animation • Pinned Panels Autoplay Management
 * Live IST Clock • Services Interactive Cards • Accessible Lightbox
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --------------------------------------------------------------------------
  // 1b. INSTANT SCROLL HELPER FOR DIAGNOSTICS & SCREENSHOTS
  // --------------------------------------------------------------------------
  const urlParams = new URLSearchParams(window.location.search);
  const targetId = urlParams.get('scroll') || (window.location.hash ? window.location.hash.slice(1) : null);
  if (targetId) {
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      document.documentElement.style.scrollBehavior = 'auto';
      document.body.style.scrollBehavior = 'auto';
      const rect = targetEl.getBoundingClientRect();
      const absTop = rect.top + (window.pageYOffset || document.documentElement.scrollTop || 0);
      window.scrollTo(0, absTop);
    }
  }
  const currentYear = new Date().getFullYear();
  const heroCopy = document.getElementById('heroCopyright');
  const footerCopy = document.getElementById('footerCopyright');
  if (heroCopy) heroCopy.innerHTML = `&copy; ${currentYear} Rixon Sunny`;
  if (footerCopy) footerCopy.innerHTML = `&copy; ${currentYear} Rixon Sunny`;

  // --------------------------------------------------------------------------
  // 1c. STICKY NAVBAR SCROLL BACKGROUND STATE
  // Transparent with soft gradient scrim over Hero and full-screen visual sections.
  // Switches to solid flat dark background exactly when the About section (id="about")
  // reaches the top of the viewport, and reverts if scrolled back above.
  // --------------------------------------------------------------------------
  const siteHeader = document.getElementById('siteHeader');
  const aboutSection = document.getElementById('about');

  if (siteHeader) {
    if (aboutSection) {
      let isScrolled = false;

      const updateNavState = () => {
        const rect = aboutSection.getBoundingClientRect();
        // Trigger solid background only once About section's top edge reaches the viewport top
        const shouldBeScrolled = rect.top <= 80;
        if (shouldBeScrolled !== isScrolled) {
          isScrolled = shouldBeScrolled;
          if (isScrolled) {
            siteHeader.classList.add('nav-scrolled');
          } else {
            siteHeader.classList.remove('nav-scrolled');
          }
        }
      };

      // IntersectionObserver integration to watch About section
      if ('IntersectionObserver' in window) {
        const aboutObserver = new IntersectionObserver(() => {
          updateNavState();
        }, {
          root: null,
          rootMargin: '-80px 0px 0px 0px',
          threshold: [0, 0.01, 0.1]
        });
        aboutObserver.observe(aboutSection);
      }

      window.addEventListener('scroll', updateNavState, { passive: true });
      window.addEventListener('resize', updateNavState, { passive: true });
      updateNavState();
    } else {
      // Subpages without an About section: solid dark background
      siteHeader.classList.add('nav-scrolled');
    }
  }

  // --------------------------------------------------------------------------
  // 2. LIVE INDIA TIME (IST Clock)
  // --------------------------------------------------------------------------
  const heroClock = document.getElementById('heroClock');
  if (heroClock) {
    const updateClock = () => {
      try {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Kolkata',
          hour12: true,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
        heroClock.textContent = timeStr;
      } catch (e) {
        const d = new Date();
        heroClock.textContent = d.toTimeString().split(' ')[0];
      }
    };
    updateClock();
    setInterval(updateClock, 1000);
  }

  // --------------------------------------------------------------------------
  // 3. OPENING ANIMATION TIMELINE (Hero)
  // Video, headline, and bottom bar fade in sequentially.
  // Navbar is always visible (no fade class on it).
  // --------------------------------------------------------------------------
  const heroVideo = document.getElementById('heroVideo');
  const triggerOpeningTimeline = () => {
    if (document.body.classList.contains('opening-triggered')) return;
    document.body.classList.add('opening-triggered');

    if (isReducedMotion) {
      document.body.classList.add('site-loaded', 'title-loaded', 'bars-loaded');
      return;
    }

    // Step 1: 0.1s - Video Fade In
    setTimeout(() => {
      document.body.classList.add('site-loaded');
    }, 100);

    // Step 2: 0.8s - Headline Fade In
    setTimeout(() => {
      document.body.classList.add('title-loaded');
    }, 800);

    // Step 3: 1.1s - Bottom Bar Fade In
    setTimeout(() => {
      document.body.classList.add('bars-loaded');
    }, 1100);
  };

  if (heroVideo) {
    heroVideo.defaultMuted = true;
    heroVideo.muted = true;
    heroVideo.playsInline = true;
    heroVideo.setAttribute('playsinline', '');
    heroVideo.setAttribute('webkit-playsinline', '');

    // Max wait 1.5s fallback then trigger anyway
    const fallbackTimer = setTimeout(triggerOpeningTimeline, 1500);

    const onFrameReady = () => {
      clearTimeout(fallbackTimer);
      triggerOpeningTimeline();
      heroVideo.play().catch(() => {});
    };

    if (heroVideo.readyState >= 2) {
      onFrameReady();
    } else {
      heroVideo.addEventListener('loadeddata', onFrameReady, { once: true });
      heroVideo.addEventListener('canplay', onFrameReady, { once: true });
    }
  } else {
    // Subpages or pages without hero
    document.body.classList.add('site-loaded', 'title-loaded', 'bars-loaded');
  }

  // --------------------------------------------------------------------------
  // 4. MOBILE FULLSCREEN MENU
  // --------------------------------------------------------------------------
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuClose = document.getElementById('menuClose');

  if (menuToggle && mobileMenu) {
    const openMenu = () => {
      mobileMenu.classList.add('open');
      mobileMenu.setAttribute('aria-hidden', 'false');
      menuToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      if (menuClose) menuClose.focus();
    };

    const closeMenu = () => {
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      menuToggle.focus();
    };

    menuToggle.addEventListener('click', openMenu);
    if (menuClose) menuClose.addEventListener('click', closeMenu);

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. SMOOTH BACK TO TOP
  // --------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --------------------------------------------------------------------------
  // 6. PROJECT PANELS VIDEO STREAMING & INTERSECTION MANAGEMENT
  // Lazy-load sources within 100% viewport margin
  // Play only visible unpinned panel, pause covered / out of view
  // --------------------------------------------------------------------------
  const panelVideos = document.querySelectorAll('.panel-video');
  const projectPanels = document.querySelectorAll('.project-panel');

  if (panelVideos.length > 0 && 'IntersectionObserver' in window) {
    // 6a. Lazy-loader for video source
    const loadObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const vid = entry.target;
          if (!vid.src && vid.dataset.src) {
            vid.src = vid.dataset.src;
            vid.load();
          }
          obs.unobserve(vid);
        }
      });
    }, { rootMargin: '100% 0px' });

    panelVideos.forEach(v => loadObserver.observe(v));

    // 6b. Autoplay visible panel only
    if (!isReducedMotion) {
      const playObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const panel = entry.target;
          const vid = panel.querySelector('.panel-video');
          if (!vid) return;

          if (entry.isIntersecting && entry.intersectionRatio > 0.45) {
            vid.defaultMuted = true;
            vid.muted = true;
            const p = vid.play();
            if (p !== undefined) p.catch(() => {});
          } else if (entry.intersectionRatio <= 0.1) {
            vid.pause();
          }
        });
      }, { threshold: [0.1, 0.45, 0.75] });

      projectPanels.forEach(p => playObserver.observe(p));
    }
  }

  // Unlock touch audio/video autoplay on mobile
  const unlockVideos = () => {
    document.querySelectorAll('video').forEach(vid => {
      if (vid.paused && vid.src) {
        vid.play().catch(() => {});
      }
    });
  };
  window.addEventListener('touchstart', unlockVideos, { once: true, passive: true });
  window.addEventListener('click', unlockVideos, { once: true, passive: true });

  // --------------------------------------------------------------------------
  // 6c. BRANDS IN-VIEW OBSERVER FOR MOBILE/TOUCH
  // --------------------------------------------------------------------------
  const brandLogos = document.querySelectorAll('.brand-logo');
  if ('IntersectionObserver' in window && brandLogos.length > 0) {
    const brandObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.2 });
    brandLogos.forEach(logo => brandObserver.observe(logo));
  }

  // --------------------------------------------------------------------------
  // 7. SERVICES INTERACTIVE CARDS (6 Cards)
  // --------------------------------------------------------------------------
  const servicesGrid = document.getElementById('servicesGrid');
  if (servicesGrid) {
    const serviceCards = Array.from(servicesGrid.querySelectorAll('.service-card'));

    const closeAllCards = () => {
      serviceCards.forEach(card => {
        card.setAttribute('aria-expanded', 'false');
        const panel = card.querySelector('.service-card-panel');
        if (panel) panel.setAttribute('aria-hidden', 'true');
      });
    };

    serviceCards.forEach(card => {
      card.addEventListener('click', (e) => {
        const isExpanded = card.getAttribute('aria-expanded') === 'true';
        if (isExpanded) {
          card.setAttribute('aria-expanded', 'false');
          const panel = card.querySelector('.service-card-panel');
          if (panel) panel.setAttribute('aria-hidden', 'true');
        } else {
          closeAllCards();
          card.setAttribute('aria-expanded', 'true');
          const panel = card.querySelector('.service-card-panel');
          if (panel) panel.setAttribute('aria-hidden', 'false');
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (!servicesGrid.contains(e.target)) {
        closeAllCards();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllCards();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 8. CONTACT FORM HANDLER
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const formSuccessBanner = document.getElementById('formSuccessBanner');
  const formErrorBanner = document.getElementById('formErrorBanner');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (formErrorBanner) formErrorBanner.classList.remove('show');
      if (formSuccessBanner) formSuccessBanner.classList.remove('show');

      const nameInput = document.getElementById('formName');
      const emailInput = document.getElementById('formEmail');
      const typeInput = document.getElementById('formType');
      const msgInput = document.getElementById('formMessage');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const type = typeInput ? typeInput.value : '';
      const msg = msgInput ? msgInput.value.trim() : '';

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!name || !email || !msg || !type) {
        showError('Please complete all required fields and select a project type.');
        return;
      }

      if (!emailRegex.test(email)) {
        showError('Please enter a valid email address.');
        return;
      }

      const action = contactForm.getAttribute('action');
      const formData = new FormData(contactForm);

      if (action && action.startsWith('http') && !action.includes('YOUR_FORMSPREE_ID')) {
        fetch(action, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: formData
        })
        .then(res => {
          if (res.ok) {
            handleSuccess();
          } else {
            showError('Could not send message right now. Please email directly at rixon9370@gmail.com.');
          }
        })
        .catch(() => {
          showError('Network error. Please email directly at rixon9370@gmail.com.');
        });
      } else {
        handleSuccess();
      }

      function handleSuccess() {
        if (formSuccessBanner) formSuccessBanner.classList.add('show');
        contactForm.reset();
      }

      function showError(text) {
        if (formErrorBanner) {
          formErrorBanner.textContent = text;
          formErrorBanner.classList.add('show');
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // 9. LIGHTBOX & CATEGORY GALLERIES
  // --------------------------------------------------------------------------
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const lightboxDialog = document.getElementById('lightboxDialog');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  const lightboxNextBtn = document.getElementById('lightboxNextBtn');

  let currentGalleryWorks = [];
  let currentLightboxIndex = -1;
  let lastActiveElement = null;

  function extractYouTubeId(w) {
    if (!w) return '';
    if (typeof w === 'string') {
      const m = w.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/);
      return m ? m[1] : (/^[\w-]{11}$/.test(w.trim()) ? w.trim() : '');
    }
    if (w.youtubeId && typeof w.youtubeId === 'string' && w.youtubeId.trim()) {
      return w.youtubeId.trim();
    }
    if (w.youtubeUrl && typeof w.youtubeUrl === 'string') {
      const m = w.youtubeUrl.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/);
      if (m) return m[1];
    }
    return '';
  }

  function displayLightboxVideo(index) {
    if (!currentGalleryWorks || index < 0 || index >= currentGalleryWorks.length) return;
    currentLightboxIndex = index;
    const work = currentGalleryWorks[index];
    const yId = extractYouTubeId(work);
    if (!yId) return;

    const isVertical = work.orientation === 'vertical';
    if (lightboxDialog) {
      lightboxDialog.classList.remove('landscape', 'vertical');
      lightboxDialog.classList.add(isVertical ? 'vertical' : 'landscape');
    }

    let iframe = document.getElementById('lightboxIframe');
    if (!iframe && lightboxDialog) {
      iframe = document.createElement('iframe');
      iframe.id = 'lightboxIframe';
      iframe.className = 'lightbox-iframe';
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      lightboxDialog.appendChild(iframe);
    }

    if (iframe) {
      iframe.src = `https://www.youtube-nocookie.com/embed/${yId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
      iframe.title = work.title || 'Video Player';
    }

    if (lightboxPrevBtn) lightboxPrevBtn.style.display = currentGalleryWorks.length > 1 ? 'flex' : 'none';
    if (lightboxNextBtn) lightboxNextBtn.style.display = currentGalleryWorks.length > 1 ? 'flex' : 'none';
  }

  window.openCategoryLightbox = function(index, worksList) {
    if (!lightboxOverlay) return;
    if (worksList) currentGalleryWorks = worksList;
    if (!currentGalleryWorks || currentGalleryWorks.length === 0) return;

    lastActiveElement = document.activeElement;
    displayLightboxVideo(index);

    lightboxOverlay.classList.add('open');
    lightboxOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (lightboxCloseBtn) lightboxCloseBtn.focus();
  };

  function closeLightbox() {
    if (!lightboxOverlay) return;
    lightboxOverlay.classList.remove('open');
    lightboxOverlay.setAttribute('aria-hidden', 'true');
    const iframe = document.getElementById('lightboxIframe');
    if (iframe) {
      iframe.src = '';
      iframe.remove();
    }
    document.body.style.overflow = '';
    currentLightboxIndex = -1;
    if (lastActiveElement) lastActiveElement.focus();
  }

  function prevLightboxVideo() {
    if (currentGalleryWorks.length <= 1) return;
    let nextIdx = currentLightboxIndex - 1;
    if (nextIdx < 0) nextIdx = currentGalleryWorks.length - 1;
    displayLightboxVideo(nextIdx);
  }

  function nextLightboxVideo() {
    if (currentGalleryWorks.length <= 1) return;
    let nextIdx = currentLightboxIndex + 1;
    if (nextIdx >= currentGalleryWorks.length) nextIdx = 0;
    displayLightboxVideo(nextIdx);
  }

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', prevLightboxVideo);
  if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', nextLightboxVideo);

  if (lightboxOverlay) {
    lightboxOverlay.addEventListener('click', (e) => {
      if (e.target === lightboxOverlay) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightboxOverlay || !lightboxOverlay.classList.contains('open')) return;
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      prevLightboxVideo();
    } else if (e.key === 'ArrowRight') {
      nextLightboxVideo();
    }
  });

  // Category Gallery Loader
  const currentCategory = document.body.dataset.category;
  const countElem = document.getElementById('categoryCount');
  const landscapeGrid = document.getElementById('categoryLandscapeGrid');
  const verticalGrid = document.getElementById('categoryVerticalGrid');
  const emptyStateElem = document.getElementById('categoryEmptyState');

  if (currentCategory && (landscapeGrid || verticalGrid)) {
    const isSubpage = window.location.pathname.includes('/pages/') || document.body.classList.contains('subpage-body');
    const primaryWorksUrl = isSubpage ? '../assets/data/works.json' : 'assets/data/works.json';

    fetch(primaryWorksUrl)
      .then(res => {
        if (!res.ok) throw new Error('Fetch failed: ' + res.status);
        return res.json();
      })
      .catch(() => {
        return fetch('/assets/data/works.json')
          .then(r => {
            if (!r.ok) throw new Error('Absolute fetch failed');
            return r.json();
          })
          .catch(() => fetch('assets/data/works.json').then(r => r.json()));
      })
      .then(works => {
        if (!Array.isArray(works)) return;

        const validWorks = works.filter(w => {
          return w && w.category === currentCategory && w.youtubeId && typeof w.youtubeId === 'string' && w.youtubeId.trim();
        });

        if (countElem) {
          countElem.textContent = `${validWorks.length} ${validWorks.length === 1 ? 'film' : 'films'}`;
        }

        if (validWorks.length === 0) {
          if (emptyStateElem) emptyStateElem.style.display = 'block';
          if (landscapeGrid) landscapeGrid.style.display = 'none';
          if (verticalGrid) verticalGrid.style.display = 'none';
          return;
        }

        if (emptyStateElem) emptyStateElem.style.display = 'none';
        currentGalleryWorks = validWorks;

        const landscapeList = [];
        const verticalList = [];

        validWorks.forEach((w, overallIdx) => {
          const itemWithIdx = { ...w, overallIndex: overallIdx };
          if (w.orientation === 'vertical') {
            verticalList.push(itemWithIdx);
          } else {
            landscapeList.push(itemWithIdx);
          }
        });

        if (landscapeGrid) {
          if (landscapeList.length > 0) {
            landscapeGrid.style.display = 'grid';
            landscapeGrid.innerHTML = landscapeList.map(item => renderCategoryCard(item, 'landscape')).join('');
          } else {
            landscapeGrid.style.display = 'none';
          }
        }

        if (verticalGrid) {
          if (verticalList.length > 0) {
            verticalGrid.style.display = 'grid';
            verticalGrid.innerHTML = verticalList.map(item => renderCategoryCard(item, 'vertical')).join('');
          } else {
            verticalGrid.style.display = 'none';
          }
        }
      })
      .catch(() => {
        if (emptyStateElem) emptyStateElem.style.display = 'block';
      });

    function renderCategoryCard(item, orientation) {
      const yId = extractYouTubeId(item);
      const isVert = orientation === 'vertical';
      const w = isVert ? 360 : 640;
      const h = isVert ? 640 : 360;
      const thumbUrl = `https://img.youtube.com/vi/${yId}/hqdefault.jpg`;
      const maxresUrl = `https://img.youtube.com/vi/${yId}/maxresdefault.jpg`;
      const safeTitle = (item.title || 'Untitled Film').replace(/"/g, '&quot;');

      return `
        <article class="work-card ${orientation}" onclick="openCategoryLightbox(${item.overallIndex})" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openCategoryLightbox(${item.overallIndex});}" tabindex="0" role="button" aria-label="Watch ${safeTitle}">
          <img src="${thumbUrl}" srcset="${thumbUrl} 480w, ${maxresUrl} 1280w" sizes="(max-width: 639px) 100vw, (max-width: 959px) 50vw, (max-width: 1279px) 33vw, 360px" alt="${safeTitle}" class="work-card-thumb" width="${w}" height="${h}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${thumbUrl}'" />
          <div class="work-card-overlay">
            <div class="work-card-top">
              <div class="play-icon-pill" aria-hidden="true">&#9658;</div>
            </div>
            <h3 class="card-title-bottom">${safeTitle}</h3>
          </div>
        </article>
      `;
    }
  }
});
