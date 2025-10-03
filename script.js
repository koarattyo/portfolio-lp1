// ==========================================
// ポートフォリオサイト メインスクリプト
// 機能: ナビゲーション, アニメーション, フォーム処理
// ==========================================

/**
 * DOM要素とグローバル変数の定義
 */
const DOMElements = {
    // ナビゲーション関連
    navigationToggle: document.getElementById('navigation-toggle'),
    navigationMenu: document.getElementById('navigation-menu'),
    header: document.querySelector('.header'),

    // フォーム関連
    contactForm: document.getElementById('contact-form'),

    // アニメーション対象要素
    animationTargets: document.querySelectorAll('.service-card, .result-card, .stats-item'),

    // スムーススクロール対象
    anchorLinks: document.querySelectorAll('a[href^="#"]')
};

// アプリケーション設定
const AppConfig = {
    scrollThreshold: 100,
    animationThreshold: 0.1,
    animationRootMargin: '0px 0px -50px 0px'
};

// ==========================================
// ナビゲーション機能
// ==========================================

/**
 * ハンバーガーメニューの初期化
 * モバイル表示時のメニュー開閉機能
 */
function initializeNavigation() {
    if (!DOMElements.navigationToggle || !DOMElements.navigationMenu) {
        console.warn('Navigation elements not found');
        return;
    }

    // メニュートグルイベント
    DOMElements.navigationToggle.addEventListener('click', toggleMobileMenu);

    // メニューリンククリック時にメニューを閉じる
    const menuLinks = DOMElements.navigationMenu.querySelectorAll('.navigation__link');
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
}

/**
 * モバイルメニューの開閉
 */
function toggleMobileMenu() {
    DOMElements.navigationMenu.classList.toggle('active');
    DOMElements.navigationToggle.classList.toggle('active');

    // アクセシビリティ対応
    const isExpanded = DOMElements.navigationMenu.classList.contains('active');
    DOMElements.navigationToggle.setAttribute('aria-expanded', isExpanded);
    DOMElements.navigationToggle.setAttribute('aria-label', isExpanded ? 'メニューを閉じる' : 'メニューを開く');
}

/**
 * モバイルメニューを閉じる
 */
function closeMobileMenu() {
    DOMElements.navigationMenu.classList.remove('active');
    DOMElements.navigationToggle.classList.remove('active');
    DOMElements.navigationToggle.setAttribute('aria-expanded', 'false');
    DOMElements.navigationToggle.setAttribute('aria-label', 'メニューを開く');
}

// ==========================================
// スクロール関連機能
// ==========================================

/**
 * スムーススクロールの初期化
 */
function initializeSmoothScroll() {
    DOMElements.anchorLinks.forEach(anchor => {
        anchor.addEventListener('click', handleSmoothScroll);
    });
}

/**
 * スムーススクロールの実行
 * @param {Event} event - クリックイベント
 */
function handleSmoothScroll(event) {
    event.preventDefault();

    const targetId = event.currentTarget.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
        // モバイルメニューを閉じる
        closeMobileMenu();

        // スムーススクロール実行
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/**
 * ヘッダーのスクロール効果
 */
function initializeHeaderScrollEffect() {
    if (!DOMElements.header) {
        console.warn('Header element not found');
        return;
    }

    window.addEventListener('scroll', updateHeaderStyle);
}

/**
 * スクロール位置に応じてヘッダーのスタイルを更新
 */
function updateHeaderStyle() {
    const scrollY = window.scrollY;

    if (scrollY > AppConfig.scrollThreshold) {
        DOMElements.header.style.background = 'rgba(255, 255, 255, 0.98)';
        DOMElements.header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        DOMElements.header.style.background = 'rgba(255, 255, 255, 0.95)';
        DOMElements.header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
}

// ==========================================
// アニメーション機能
// ==========================================

/**
 * Intersection Observerを使用したフェードインアニメーション
 */
function initializeFadeInAnimation() {
    // Intersection Observerの設定
    const observerOptions = {
        threshold: AppConfig.animationThreshold,
        rootMargin: AppConfig.animationRootMargin
    };

    const fadeObserver = new IntersectionObserver(handleFadeInAnimation, observerOptions);

    // 対象要素を監視対象に追加
    DOMElements.animationTargets.forEach(element => {
        // 初期状態を設定
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';

        // 監視開始
        fadeObserver.observe(element);
    });
}

/**
 * フェードインアニメーションの実行
 * @param {IntersectionObserverEntry[]} entries - 監視要素の情報
 */
function handleFadeInAnimation(entries) {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // 少しずつ遅延してアニメーション実行
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}

// ==========================================
// フォーム処理
// ==========================================

/**
 * お問い合わせフォームの初期化
 */
function initializeContactForm() {
    if (!DOMElements.contactForm) {
        console.warn('Contact form not found');
        return;
    }

    DOMElements.contactForm.addEventListener('submit', handleFormSubmission);

    // リアルタイムバリデーション
    const formFields = DOMElements.contactForm.querySelectorAll('.form-field__input, .form-field__textarea');
    formFields.forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => clearFieldError(field));
    });
}

/**
 * フォーム送信処理
 * @param {Event} event - 送信イベント
 */
function handleFormSubmission(event) {
    event.preventDefault();

    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    // フォームデータの取得
    const formData = new FormData(DOMElements.contactForm);
    const formValues = {
        company: formData.get('company'),
        name: formData.get('name'),
        email: formData.get('email'),
        service: formData.get('service'),
        message: formData.get('message')
    };

    // バリデーション実行
    const isValid = validateForm(formValues);

    if (isValid) {
        // ローディング状態にする
        submitButton.disabled = true;
        submitButton.textContent = '送信中...';
        submitButton.style.opacity = '0.6';
        submitButton.style.cursor = 'not-allowed';

        // 送信処理をシミュレート（実際はここにAPI呼び出しなどを記述）
        setTimeout(() => {
            // 送信成功処理
            handleFormSuccess();

            // ボタンを元に戻す
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            submitButton.style.opacity = '1';
            submitButton.style.cursor = 'pointer';
        }, 1000);
    }
}

/**
 * フォーム全体のバリデーション
 * @param {Object} formValues - フォーム値
 * @returns {boolean} バリデーション結果
 */
function validateForm(formValues) {
    let isValid = true;

    // 必須項目チェック
    const requiredFields = ['company', 'name', 'email', 'message'];
    requiredFields.forEach(fieldName => {
        if (!formValues[fieldName] || formValues[fieldName].trim() === '') {
            showFieldError(fieldName, 'この項目は必須です');
            isValid = false;
        }
    });

    // メールアドレス形式チェック
    if (formValues.email && !isValidEmail(formValues.email)) {
        showFieldError('email', '有効なメールアドレスを入力してください');
        isValid = false;
    }

    return isValid;
}

/**
 * 個別フィールドのバリデーション
 * @param {HTMLElement} field - 対象フィールド
 */
function validateField(field) {
    const fieldName = field.name;
    const fieldValue = field.value.trim();

    // 必須項目チェック
    if (field.required && fieldValue === '') {
        showFieldError(fieldName, 'この項目は必須です');
        return false;
    }

    // メールアドレスチェック
    if (fieldName === 'email' && fieldValue && !isValidEmail(fieldValue)) {
        showFieldError(fieldName, '有効なメールアドレスを入力してください');
        return false;
    }

    clearFieldError(fieldName);
    return true;
}

/**
 * メールアドレスの形式チェック
 * @param {string} email - メールアドレス
 * @returns {boolean} 有効性
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * フィールドエラー表示
 * @param {string} fieldName - フィールド名
 * @param {string} message - エラーメッセージ
 */
function showFieldError(fieldName, message) {
    const errorElement = document.getElementById(`${fieldName}-error`);
    const fieldElement = document.getElementById(fieldName);

    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('active');
    }

    if (fieldElement) {
        fieldElement.style.borderColor = '#ef4444';
    }
}

/**
 * フィールドエラー非表示
 * @param {string|HTMLElement} fieldOrName - フィールド要素またはフィールド名
 */
function clearFieldError(fieldOrName) {
    const fieldName = typeof fieldOrName === 'string' ? fieldOrName : fieldOrName.name;
    const errorElement = document.getElementById(`${fieldName}-error`);
    const fieldElement = document.getElementById(fieldName);

    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('active');
    }

    if (fieldElement) {
        fieldElement.style.borderColor = '';
    }
}

/**
 * フォーム送信成功処理
 */
function handleFormSuccess() {
    // 成功メッセージ表示
    alert('お問い合わせありがとうございます！\n内容を確認の上、後日ご連絡させていただきます。');

    // フォームリセット
    DOMElements.contactForm.reset();

    // すべてのフィールドのボーダー色をリセット
    const formFields = DOMElements.contactForm.querySelectorAll('.form-field__input, .form-field__textarea');
    formFields.forEach(field => {
        field.style.borderColor = '';
    });

    // エラー表示をクリア
    const errorElements = DOMElements.contactForm.querySelectorAll('.form-field__error');
    errorElements.forEach(error => {
        error.textContent = '';
        error.classList.remove('active');
    });
}

// ==========================================
// スクロール進捗バー
// ==========================================

/**
 * スクロール進捗バーの作成と初期化
 */
function initializeScrollProgressBar() {
    const progressBar = createProgressBarElement();
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => updateProgressBar(progressBar));
}

/**
 * プログレスバー要素の作成
 * @returns {HTMLElement} プログレスバー要素
 */
function createProgressBarElement() {
    const progressBar = document.createElement('div');

    // スタイル設定
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #667eea, #764ba2);
        z-index: 10001;
        transition: width 0.1s ease;
        border-radius: 0 2px 2px 0;
    `;

    return progressBar;
}

/**
 * スクロール進捗の更新
 * @param {HTMLElement} progressBar - プログレスバー要素
 */
function updateProgressBar(progressBar) {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = Math.min((scrollTop / docHeight) * 100, 100);

    progressBar.style.width = scrollPercent + '%';
}

// ==========================================
// 背景画像処理（将来の拡張用）
// ==========================================

/**
 * 背景画像の遅延読み込み（コメントアウト - 将来の機能拡張用）
 */
/*
function initializeBackgroundImage() {
    // 将来的に動的な背景画像読み込み機能を実装する場合に使用
    const heroBackground = document.querySelector('.hero-section__background');

    if (heroBackground) {
        // 画像の存在チェックとフォールバック処理
        const img = new Image();
        img.onload = function() {
            console.log('Background image loaded successfully');
        };
        img.onerror = function() {
            console.log('Using fallback background');
            heroBackground.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        };
        img.src = 'images/annie-spratt-0ZPSX_mQ3xI-unsplash.jpg';
    }
}
*/

// ==========================================
// アプリケーション初期化
// ==========================================

/**
 * アプリケーション全体の初期化
 * DOMContentLoadedイベントで実行
 */
function initializeApp() {
    try {
        console.log('Initializing portfolio application...');

        // 各機能の初期化
        initializeNavigation();
        initializeSmoothScroll();
        initializeHeaderScrollEffect();
        initializeFadeInAnimation();
        initializeContactForm();
        initializeScrollProgressBar();

        console.log('Portfolio application initialized successfully');

    } catch (error) {
        console.error('Error initializing application:', error);
    }
}

/**
 * パフォーマンス監視（オプション）
 */
function logPerformanceMetrics() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page load time:', Math.round(perfData.loadEventEnd - perfData.fetchStart), 'ms');
            }, 0);
        });
    }
}

// ==========================================
// アプリケーション開始
// ==========================================

// DOM読み込み完了後にアプリケーションを初期化
document.addEventListener('DOMContentLoaded', initializeApp);

// パフォーマンス監視（開発時のみ）
if (typeof console !== 'undefined') {
    logPerformanceMetrics();
}

// エラーハンドリング
window.addEventListener('error', (event) => {
    console.error('Global error caught:', event.error);
});