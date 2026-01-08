// 流星アニメーション（画像版）
function createMeteor(){
  const meteor = document.createElement('img');
  meteor.className = 'meteor';
  meteor.src = 'assets/meteor-icon.png';
  meteor.alt = 'meteor';
  
  const startX = Math.random() * window.innerWidth;
  const duration = 2000 + Math.random() * 2000;
  const delay = Math.random() * 2000;
  
  meteor.style.left = startX + 'px';
  meteor.style.top = '-80px';
  meteor.style.animation = `meteor ${duration}ms linear ${delay}ms forwards`;
  
  document.body.appendChild(meteor);
  
  setTimeout(()=>meteor.remove(), duration + delay + 100);
}

// 定期的に流星を生成
setInterval(createMeteor, 1000);

// 3Dシーン初期化
let scene, camera, renderer, cube;

function initThreeJS(){
  const container = document.getElementById('threejs-container');
  if(!container || container.clientWidth === 0) return;

  // シーン設定
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  const width = container.clientWidth;
  const height = container.clientHeight;
  
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 3;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // 3Dキューブ作成
  const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
  const materials = [
    new THREE.MeshPhongMaterial({ color: 0x4ade80, emissive: 0x2d6b3c }),
    new THREE.MeshPhongMaterial({ color: 0x06b6d4, emissive: 0x034d5a }),
    new THREE.MeshPhongMaterial({ color: 0x7c3aed, emissive: 0x3d1a76 }),
    new THREE.MeshPhongMaterial({ color: 0xf59e0b, emissive: 0x78471f }),
    new THREE.MeshPhongMaterial({ color: 0xec4899, emissive: 0x761b52 }),
    new THREE.MeshPhongMaterial({ color: 0x14b8a6, emissive: 0x0a5d52 })
  ];
  cube = new THREE.Mesh(geometry, materials);
  scene.add(cube);

  // ライト
  const light1 = new THREE.PointLight(0x4ade80, 1.2, 100);
  light1.position.set(5, 5, 5);
  scene.add(light1);

  const light2 = new THREE.PointLight(0x06b6d4, 0.8, 100);
  light2.position.set(-5, -5, 5);
  scene.add(light2);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  // リサイズ対応
  window.addEventListener('resize', ()=>{
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  });

  // アニメーションループ
  function animate(){
    requestAnimationFrame(animate);
    if(cube){
      cube.rotation.x += 0.005;
      cube.rotation.y += 0.008;
    }
    renderer.render(scene, camera);
  }
  animate();
}

// 3Dカードフリップ
document.addEventListener('DOMContentLoaded', ()=>{
  // Three.js初期化
  initThreeJS();

  const cta = document.querySelector('.cta');
  if(cta){
    cta.addEventListener('click', ()=>{
      const firstSection = document.querySelector('.hero');
      firstSection && firstSection.scrollIntoView({behavior:'smooth'});
    });
  }

  // フォーム送信のダミー処理
  const form = document.querySelector('.contact-form');
  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      alert('送信ありがとうございます！(デモ)');
      form.reset();
    });
  }

  // Showcaseアイテムにホバーエフェクト
  const showcaseItems = document.querySelectorAll('.showcase-item');
  showcaseItems.forEach((item, index)=>{
    item.addEventListener('mouseenter', ()=>{
      item.style.zIndex = 10;
    });
  });
});