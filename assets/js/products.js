// ============================================================
// products.js — M-Link Corporate Site
// 商品フィルター・ライトボックス
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initProductFilter();
  initProductDetail();
  initGallery();
  initFormPrefill();
});

const productCatalogue = {
  crane: {
    name: 'クレーンゲーム機', category: 'クレーンゲーム機', catalogNo: 'CAT. 01',
    image: '../assets/images/top/product_crane_generated.png',
    lead: '店舗規模や設置環境に合わせて、最適なサイズ・仕様をご提案します。',
    description: '景品の魅力を引き出し、幅広い店舗・施設で集客に活用できるクレーンゲーム機です。設置スペース、想定客層、ご予算に合わせて、新品・中古から適した機種をご案内します。',
    features: ['店舗規模に合わせた筐体サイズを選定', '新品・中古の両方から予算に応じて提案', '搬入・設置・動作確認まで一括対応'],
    newStock: ['在庫あり', 'is-available'], usedStock: ['在庫あり', 'is-available'],
    location: 'アミューズメント施設、商業施設、店舗など', size: '取扱機種により異なります', condition: '新品・中古',
    support: '機器選定・搬入・設置・動作確認',
    notes: '搬入経路、設置スペース、電源環境をご確認ください。中古品は機種ごとに外観・仕様が異なるため、詳細写真や状態をご案内します。'
  },
  capsule: {
    name: 'カプセルマシーン', category: 'カプセルマシーン', catalogNo: 'CAT. 02',
    image: '../assets/images/top/product_capsule_generated.png',
    lead: '省スペースから多連設置まで、売場に合わせた構成に対応します。',
    description: '小さなスペースにも導入しやすく、幅広い客層への販売機会をつくるカプセルマシーンです。単体設置から複数台構成まで、売場面積と運用方法に合わせてご提案します。',
    features: ['設置面積に応じた台数・連数を選択', '店舗や施設の雰囲気に合わせやすい構成', '初めての導入でも運用方法からサポート'],
    newStock: ['在庫あり', 'is-available'], usedStock: ['要問い合わせ', 'is-contact'],
    location: '商業施設、物販店、飲食店、待合スペースなど', size: '単体・多連タイプなど', condition: '新品・中古',
    support: '機器選定・構成提案・納品・設置',
    notes: '設置場所の寸法と運用スペースをご確認ください。対応カプセル径や硬貨仕様は機種により異なります。'
  },
  'trading-card-vending': {
    name: 'トレカ自動販売機', category: 'トレカ自動販売機', catalogNo: 'CAT. 03',
    image: '../assets/images/top/product_trading_card_vending_generated.png',
    lead: '無人販売と省人化を支える、トレーディングカード専用販売機です。',
    description: '営業時間やスタッフ配置に左右されにくい販売環境をつくる、トレーディングカード向け自動販売機です。販売方法や設置場所を伺い、運用に適した仕様をご案内します。',
    features: ['省人化・無人販売の運用をサポート', '商品構成や販売方法に合わせた仕様選定', '店舗内外の設置計画から相談可能'],
    newStock: ['取寄せ', 'is-order'], usedStock: ['在庫なし', 'is-unavailable'],
    location: 'トレカショップ、商業施設、店舗内外など', size: '取扱機種・収納仕様により異なります', condition: '新品中心',
    support: '仕様選定・納期確認・搬入・設置',
    notes: '電源、設置面の水平、管理・補充スペースをご確認ください。納期はメーカーや仕様により変動します。'
  },
  locker: {
    name: '鍵付き8段ロッカー', category: 'その他・関連設備', catalogNo: 'CAT. 04',
    image: '../assets/images/top/product_locker_generated.png',
    lead: '店舗運営やバックヤードの整理に適した、鍵付き収納設備です。',
    description: '限られたスペースを有効活用できる8段構成の鍵付きロッカーです。スタッフ用収納、備品管理、商品保管など、店舗運営の用途に合わせて導入いただけます。',
    features: ['縦方向を活用できる省スペース設計', '各収納部に鍵を備えた管理しやすい構成', 'アミューズメント機器と合わせた導入相談に対応'],
    newStock: ['在庫あり', 'is-available'], usedStock: ['在庫なし', 'is-unavailable'],
    location: '店舗バックヤード、スタッフルーム、事務所など', size: '8段タイプ・詳細寸法はお問い合わせ', condition: '新品',
    support: '仕様確認・納品・設置場所のご相談',
    notes: '設置場所の幅・奥行き・高さと、扉の開閉スペースをご確認ください。固定方法は設置環境に応じてご案内します。'
  }
};

function initProductDetail() {
  const title = document.querySelector('#product-title');
  if (!title) return;

  const id = new URLSearchParams(window.location.search).get('id') || 'crane';
  const product = productCatalogue[id] || productCatalogue.crane;
  const setText = (selector, value) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  };
  const setStock = (selector, stock) => {
    const element = document.querySelector(selector);
    if (!element) return;
    element.className = stock[1];
    element.innerHTML = `<span></span>${stock[0]}`;
  };

  document.title = `${product.name} | 製品情報 | 株式会社M-Link`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', `株式会社M-Linkが取り扱う${product.name}の製品情報。特徴、仕様、新品・中古の在庫状況をご案内します。`);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', `${product.name} | 製品情報 | 株式会社M-Link`);
  setText('#breadcrumb-product-name', product.name);
  setText('#product-title', product.name);
  setText('#product-category', product.category);
  setText('#product-catalog-no', product.catalogNo);
  setText('#product-lead', product.lead);
  setText('.product-description', product.description);
  setText('#spec-category', product.category);
  setText('#spec-condition', product.condition);
  setText('#spec-location', product.location);
  setText('#spec-size', product.size);
  setText('#spec-support', product.support);
  setText('#product-notes', product.notes);
  setStock('#detail-stock-new', product.newStock);
  setStock('#detail-stock-used', product.usedStock);

  const image = document.querySelector('#gallery-main');
  if (image) {
    image.src = product.image;
    image.alt = `${product.name}の製品イメージ`;
  }
  const features = document.querySelector('#product-features-list');
  if (features) features.innerHTML = product.features.map(feature => `<li class="product-features__item">${feature}</li>`).join('');

  const contactUrl = `/?product=${encodeURIComponent(product.name)}#contact-form-section`;
  document.querySelector('#detail-contact-btn')?.setAttribute('href', contactUrl);
  document.querySelector('#detail-bottom-contact')?.setAttribute('href', contactUrl);

  const structuredData = document.querySelector('#product-structured-data');
  if (structuredData) {
    const data = JSON.parse(structuredData.textContent);
    data.name = product.name;
    data.description = product.description;
    data.image = new URL(product.image, window.location.href).href;
    structuredData.textContent = JSON.stringify(data);
  }

  document.querySelectorAll('.related-products a[href*="detail.html"]').forEach(link => {
    const relatedId = new URL(link.href, window.location.href).searchParams.get('id');
    link.closest('.product-card')?.toggleAttribute('hidden', relatedId === id);
  });
}

// ============================================================
// Product Filter (Archive page)
// ============================================================

function initProductFilter() {
  const filterBar = document.querySelector('#product-filter');
  if (!filterBar) return;

  const tabs = filterBar.querySelectorAll('.product-filter__tab');
  const cards = document.querySelectorAll('.product-card[data-stock]');
  const countEl = document.querySelector('#filter-count');

  function applyFilter(stock, cat) {
    let visible = 0;
    cards.forEach(card => {
      const cardStock = card.dataset.stock;
      const cardCat  = card.dataset.category;
      const matchStock = !stock || stock === 'all' || cardStock === stock;
      const matchCat  = !cat  || cat  === 'all' || cardCat  === cat;
      const show = matchStock && matchCat;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    if (countEl) countEl.textContent = `${visible} 件`;

    // Show empty state
    const emptyEl = document.querySelector('#products-empty');
    if (emptyEl) emptyEl.style.display = visible === 0 ? '' : 'none';
  }

  // Read URL params on load
  const params = new URLSearchParams(window.location.search);
  const initStock = params.get('stock') || 'all';
  const initCat  = params.get('cat')  || 'all';

  // Set initial active tab per filter group
  ['stock', 'cat'].forEach(group => {
    const value = group === 'stock' ? initStock : initCat;
    const groupTabs = filterBar.querySelectorAll(`.product-filter__tab[data-group="${group}"]`);
    const hasValue = Array.from(groupTabs).some(tab => tab.dataset.filter === value);

    groupTabs.forEach(tab => {
      const isActive = tab.dataset.filter === (hasValue ? value : 'all');
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-pressed', String(isActive));
    });
  });

  applyFilter(initStock, initCat);

  // Tab click
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const group = tab.dataset.group; // 'stock' or 'cat'
      const val   = tab.dataset.filter;

      // Deactivate tabs in same group
      filterBar.querySelectorAll(`.product-filter__tab[data-group="${group}"]`)
        .forEach(t => {
          t.classList.remove('is-active');
          t.setAttribute('aria-pressed', 'false');
        });
      tab.classList.add('is-active');
      tab.setAttribute('aria-pressed', 'true');

      // Get current active values
      const activeStock = filterBar.querySelector('.product-filter__tab[data-group="stock"].is-active')?.dataset.filter || 'all';
      const activeCat  = filterBar.querySelector('.product-filter__tab[data-group="cat"].is-active')?.dataset.filter  || 'all';

      applyFilter(activeStock, activeCat);

      const nextParams = new URLSearchParams(window.location.search);
      activeStock === 'all' ? nextParams.delete('stock') : nextParams.set('stock', activeStock);
      activeCat === 'all' ? nextParams.delete('cat') : nextParams.set('cat', activeCat);
      const nextQuery = nextParams.toString();
      window.history.replaceState({}, '', `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ''}`);
    });
  });
}

// ============================================================
// Product Gallery (Detail page)
// ============================================================

function initGallery() {
  const mainImg = document.querySelector('#gallery-main');
  if (!mainImg) return;

  const thumbs = document.querySelectorAll('.product-gallery__thumb');

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('is-active'));
      thumb.classList.add('is-active');
      const newSrc = thumb.dataset.src;
      const newAlt = thumb.dataset.alt || '';
      mainImg.src = newSrc;
      mainImg.alt = newAlt;
    });
  });
}

// ============================================================
// Form Prefill from URL param (商品詳細 → お問い合わせ)
// ============================================================

function initFormPrefill() {
  const params = new URLSearchParams(window.location.search);
  const productName = params.get('product');
  const productInput = document.querySelector('#f-product');
  if (productName && productInput) {
    productInput.value = decodeURIComponent(productName);
  }
}
