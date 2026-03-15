import"./auth-CRFqR3Ed.js";import"./donate-quick-modal-DSVpZ7c_.js";var e=`https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod`,t=`../../assets/images/`,n=`../../assets/icons/`,r={1:`cameras/1.jpg`,2:`cameras/2.jpg`,3:`cameras/3.jpg`,4:`cameras/4.jpg`,5:`cameras/5.jpg`,6:`cameras/6.jpg`,7:`cameras/7.jpg`,8:`cameras/8.jpg`},i={1:`panda.svg`,2:`lemur.svg`,3:`gorilla.svg`,4:`alligator.svg`,5:`eagle.svg`,6:`coala.svg`,7:`lion.svg`,8:`tiger.svg`},a={1:`youtube-player-giant-panda.jpg`,2:`youtube-player-lemur.jpg`,3:`youtube-player-gorilla.jpg`,5:`youtube-player-eagles.jpg`},o={1:[{img:`panda-additional-cam-card-1.jpg`,label:`CAM 1`},{img:`panda-additional-cam-card-2.jpg`,label:`CAM 2`},{img:`panda-additional-cam-card-3.jpg`,label:`CAM 3`}],2:[{img:`lemur-additional-cam-card-1.jpg`,label:`CAM 1`},{img:`lemur-additional-cam-card-2.jpg`,label:`CAM 2`},{img:`lemur-additional-cam-card-3.jpg`,label:`CAM 3`}],3:[{img:`gorilla-additional-cam-card-1.jpg`,label:`CAM 1`},{img:`gorilla-additional-cam-card-2.jpg`,label:`CAM 2`},{img:`gorilla-additional-cam-card-3.jpg`,label:`CAM 3`}],5:[{img:`eagles-additional-cam-card-1.jpg`,label:`CAM 1`},{img:`eagles-additional-cam-card-2.jpg`,label:`CAM 2`},{img:`eagles-additional-cam-card-3.jpg`,label:`CAM 3`}]},s=[],c=[],l=0;function u(e){return c.find(t=>t.id===e)}function d(e){return n+(i[e]??`pet-placeholder.svg`)}function f(e){return t+(r[e]??`cameras/1.jpg`)}function p(e){let t=document.createElement(`div`);return t.textContent=e,t.innerHTML}function m(e){let t=e.match(/([\d.]+)°?\s*([NSEW])/i);if(!t)return 0;let n=parseFloat(t[1]),r=t[2].toUpperCase();return r===`S`||r===`W`?-n:n}function h(e,t,n){let r=document.getElementById(`mapModal`);r||(r=document.createElement(`div`),r.id=`mapModal`,r.className=`map-modal`,r.innerHTML=`
      <div class="map-modal__overlay"></div>
      <div class="map-modal__window">
        <button class="map-modal__close" aria-label="Close">&times;</button>
        <h3 class="map-modal__title"></h3>
        <iframe class="map-modal__iframe" frameborder="0" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
    `,document.body.appendChild(r),r.querySelector(`.map-modal__overlay`)?.addEventListener(`click`,g),r.querySelector(`.map-modal__close`)?.addEventListener(`click`,g));let i=r.querySelector(`.map-modal__title`);i&&(i.textContent=n);let a=r.querySelector(`.map-modal__iframe`);a&&(a.src=`https://maps.google.com/maps?q=${e},${t}&z=6&output=embed`),r.classList.add(`is-open`),document.body.style.overflow=`hidden`}function g(){let e=document.getElementById(`mapModal`);if(!e)return;e.classList.remove(`is-open`),document.body.style.overflow=``;let t=e.querySelector(`.map-modal__iframe`);t&&(t.src=``)}document.addEventListener(`keydown`,e=>{e.key===`Escape`&&g()});function _(){let e=document.getElementById(`sidebarNav`);e&&(e.innerHTML=``,s.forEach((t,n)=>{let r=u(t.petId),i=r?`${r.name} — ${r.commonName}`:`Camera ${t.id}`,a=document.createElement(`button`);a.className=`zoos-sidebar__item`+(n===l?` active`:``),a.setAttribute(`aria-label`,i);let o=d(t.petId),s=p(t.text);a.innerHTML=`<span class="zoos-sidebar__icon"><img src="${o}" alt="${p(i)}"></span><span class="zoos-sidebar__label">${s}</span>`,a.addEventListener(`click`,()=>{l=n,_(),C(t.petId)}),e.appendChild(a)}))}var v=document.getElementById(`zoosContentRoot`);function y(){let e=document.getElementById(`contentOverlay`);e||(e=document.createElement(`div`),e.id=`contentOverlay`,e.className=`zoos-content-overlay`,e.innerHTML=`
      <div class="zoos-content-overlay__spinner"></div>
      <div class="zoos-content-overlay__error">
        <div class="zoos-loader__error-icon">!</div>
        <p class="zoos-loader__error-text">Something went wrong. Please, refresh the page</p>
      </div>
    `,v?.appendChild(e)),e.classList.remove(`is-hidden`,`is-error`)}function b(){document.getElementById(`contentOverlay`)?.classList.add(`is-hidden`)}function x(){document.getElementById(`contentOverlay`)?.classList.add(`is-error`)}function S(e,n,i){if(!v)return;v.querySelector(`.zoos-content, .zoos-donation`)&&v.querySelectorAll(`.zoos-content, .zoos-donation`).forEach(e=>e.remove());let s=`${i.commonName} Cams`,c=a[e.petId]?t+a[e.petId]:f(e.petId),l=f(e.petId),u=o[e.petId]??[{img:r[e.petId]??`cameras/1.jpg`,label:`CAM 1`}],d=``;u.forEach((e,n)=>{d+=`
      <a class="zoos-cam-card${n===0?` active`:``}" href="https://www.youtube.com/c/RSSchool/" target="_blank" rel="noopener noreferrer">
        <img src="${t+e.img}" alt="${p(e.label)}">
        <div class="zoos-cam-card__play"></div>
      </a>
    `});let g=[[`Common name:`,i.commonName],[`Scientific name:`,i.scientificName],[`Type:`,i.type],[`Size:`,i.size],[`Diet:`,i.diet],[`Habitat:`,i.habitat],[`Range:`,i.range]],_=``;g.forEach(([e,t])=>{e===`Range:`?_+=`<tr><td>${p(e)}</td><td>${p(t)} <button class="zoos-info__map-link" data-lat="${p(i.latitude)}" data-lng="${p(i.longitude)}" data-title="${p(i.commonName)}">View Map</button></td></tr>`:_+=`<tr><td>${p(e)}</td><td>${p(t)}</td></tr>`});let y=document.createElement(`div`);y.className=`zoos-content container`,y.innerHTML=`
    <div class="zoos-content__header">
      <h1 class="zoos-content__title">${p(s)}</h1>
      <button class="zoos-content__donate-btn button_orange">Donate Now</button>
    </div>
    <div class="zoos-player">
      <div class="zoos-player__frame">
        <img class="zoos-player__img" src="${c}" alt="${p(s)}">
        <a class="zoos-player__link" href="https://www.youtube.com/c/RSSchool/" target="_blank" rel="noopener noreferrer" aria-label="Watch on YouTube"></a>
        <div class="zoos-player__overlay">
          <button class="zoos-player__play" aria-label="Play"></button>
        </div>
      </div>
    </div>
    <div class="zoos-more-views">
      <h2 class="visually-hidden">Live Views</h2>
      <h3 class="zoos-more-views__title">More Live Views</h3>
      <div class="zoos-more-views__slider">
        <button class="zoos-more-views__arrow" aria-label="Previous">&#8592;</button>
        <div class="zoos-more-views__cards">${d}</div>
        <button class="zoos-more-views__arrow" aria-label="Next">&#8594;</button>
      </div>
    </div>
  `;let b=document.createElement(`section`);b.className=`zoos-donation`,b.innerHTML=`
    <div class="zoos-donation__inner container">
      <div class="zoos-donation__content">
        <h3 class="zoos-donation__title">Support ${p(n.name)} the ${p(i.commonName)}!</h3>
        <p class="zoos-donation__text">${p(i.description)}</p>
      </div>
      <div class="zoos-donation__form">
        <p class="subheader">Quick Donate</p>
        <form class="donate-form">
          <input class="donate-form__input" placeholder="$ Donation Amount">
          <button class="donate-form__btn button_orange" type="submit"></button>
        </form>
      </div>
    </div>
  `;let x=document.createElement(`div`);x.className=`zoos-content container`,x.innerHTML=`
    <div class="zoos-fact">
      <h2 class="zoos-fact__title">Did you know?</h2>
      <p class="zoos-fact__text">${p(i.detailedDescription)}</p>
    </div>
    <div class="zoos-info">
      <table class="zoos-info__table">
        <tbody>${_}</tbody>
      </table>
      <img class="zoos-info__photo" src="${l}" alt="${p(s)}">
    </div>
    <p class="zoos-description">${p(i.description)}</p>
  `;let S=document.getElementById(`contentOverlay`);S?(v.insertBefore(x,S),v.insertBefore(b,x),v.insertBefore(y,b)):(v.appendChild(y),v.appendChild(b),v.appendChild(x));let C=x.querySelector(`.zoos-info__map-link`);C?.addEventListener(`click`,()=>{h(m(C.dataset.lat??``),m(C.dataset.lng??``),C.dataset.title??``)}),y.querySelector(`.zoos-content__donate-btn`)?.addEventListener(`click`,()=>{window.openDonateStepsModal(e.petId)})}async function C(t){let n=s[l],r=u(t);if(!(!n||!r)){y();try{let i=await fetch(`${e}/pets/${t}`);if(!i.ok)throw Error(`Failed to fetch pet detail`);S(n,r,(await i.json()).data),b()}catch{x()}}}var w=document.querySelector(`.zoos-main`),T=document.getElementById(`zoosLoader`);function E(){w?.classList.add(`zoos-main--loading`),T?.classList.remove(`is-hidden`)}function D(){w?.classList.remove(`zoos-main--loading`),T?.classList.add(`is-hidden`)}function O(){let e=document.getElementById(`zoosLayout`);if(!e)return;let t=document.createElement(`div`);t.className=`zoos-sidebar-overlay`,t.id=`zoosSidebarOverlay`;let r=document.createElement(`button`);r.className=`zoos-sidebar-trigger`,r.id=`zoosSidebarTrigger`,r.setAttribute(`aria-label`,`Open camera list`),r.innerHTML=`<span class="zoos-sidebar-trigger__live">LIVE</span><img src="${n}live-camera.svg" alt="Live">`;let i=document.createElement(`aside`);i.className=`zoos-sidebar`,i.innerHTML=`
    <div class="zoos-sidebar__header">
      <div class="zoos-sidebar__live">
        <span class="zoos-sidebar__live-text">LIVE</span>
        <img class="zoos-sidebar__live-icon" src="${n}live-camera.svg" alt="Live">
      </div>
      <button class="zoos-sidebar__expand" aria-label="Expand sidebar"><img src="${n}expand.svg" alt="Expand"></button>
    </div>
    <nav class="zoos-sidebar__nav" id="sidebarNav"></nav>
    <button class="zoos-sidebar__scroll-down" aria-label="Scroll down">&#8964;</button>
  `,e.prepend(i),e.prepend(r),e.prepend(t);let a=i.querySelector(`.zoos-sidebar__expand`);function o(){i.classList.add(`is-expanded`)}function s(){i.classList.remove(`is-expanded`)}a?.addEventListener(`click`,()=>{i.classList.contains(`is-expanded`)?s():o()}),t.addEventListener(`click`,s),r.addEventListener(`click`,o)}async function k(){E();try{let[t,n]=await Promise.all([fetch(`${e}/cameras`),fetch(`${e}/pets`)]);if(!t.ok||!n.ok)throw Error(`API request failed`);let r=await t.json(),i=await n.json();s=r.data,c=i.data,l=0,O(),_(),await C(s[0].petId)}catch{T?.classList.add(`is-error`);return}D()}(function(){let e=document.getElementById(`headerBurger`),t=document.getElementById(`sideNav`),n=document.getElementById(`sideNavOverlay`),r=document.getElementById(`sideNavClose`);function i(){t?.classList.add(`is-open`),document.body.style.overflow=`hidden`}function a(){t?.classList.remove(`is-open`),document.body.style.overflow=``}e?.addEventListener(`click`,i),r?.addEventListener(`click`,a),n?.addEventListener(`click`,a),document.addEventListener(`keydown`,function(e){e.key===`Escape`&&a()})})(),k();