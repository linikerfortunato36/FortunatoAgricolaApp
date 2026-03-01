import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-landing-page',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="landing-container">
      <!-- Hero Section -->
      <section class="hero">
        <div class="overlay"></div>
        <div class="hero-content">
          <nav class="nav-bar">
            <div class="logo">
              <span class="logo-accent">Fortunato</span> Agrícola
            </div>
            <div class="nav-links">
              <a href="#sobre">Sobre</a>
              <a href="#quem-somos">Quem Somos</a>
              <a href="#nossos-clientes">Clientes</a>
              <button routerLink="/login" class="btn-primary access-btn">Acessar Sistema</button>
            </div>
          </nav>

          <header class="hero-text animate-up">
            <h1>Excelência no Comércio de Grãos</h1>
            <p>Conectando o campo ao mercado com tecnologia, transparência e solidez.</p>
            <div class="hero-actions">
              <button routerLink="/login" class="btn-main">Conhecer Plataforma</button>
              <a href="#sobre" class="btn-sec">Saiba Mais</a>
            </div>
          </header>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="stats">
        <div class="stat-card">
          <span class="stat-value">+100k</span>
          <span class="stat-label">Toneladas Negociadas</span>
        </div>
        <div class="stat-card">
            <span class="stat-value">+500</span>
            <span class="stat-label">Produtores Parceiros</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">24/7</span>
            <span class="stat-label">Suporte e Logística</span>
          </div>
      </section>

      <!-- Sobre Section -->
      <section id="sobre" class="section">
        <div class="container grid-2">
          <div class="image-box">
            <img src="https://images.unsplash.com/photo-1594754593411-925749774682?q=80&w=1000&auto=format&fit=crop" alt="Silos de Grãos">
          </div>
          <div class="content">
            <span class="subtitle">O que entregamos</span>
            <h2>Tecnologia e Logística de Ponta</h2>
            <p>A Fortunato Agrícola atua na intermediação de compra e venda de soja e milho, garantindo as melhores taxas e o escoamento eficiente da produção.</p>
            <ul class="features">
              <li>Mapeamento de rotas de transporte</li>
              <li>Análise de qualidade certificada</li>
              <li>Gestão de contratos simplificada</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <p>&copy; 2026 Fortunato Agrícola - Todos os direitos reservados.</p>
      </footer>
    </div>
  `,
    styles: [`
    :host { font-family: 'Inter', sans-serif; }
    .landing-container { overflow-x: hidden; scroll-behavior: smooth; }

    /* Hero */
    .hero {
      height: 100vh;
      background: url('https://images.unsplash.com/photo-1595058012435-0c6ca7b4159c?q=80&w=2000&auto=format&fit=crop') center/cover no-repeat;
      position: relative;
      color: white;
    }
    .overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(10, 31, 10, 0.8) 0%, rgba(30, 60, 30, 0.4) 100%);
    }
    .hero-content {
      position: relative;
      z-index: 2;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    /* Nav */
    .nav-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30px 0;
    }
    .logo { font-size: 1.5rem; font-weight: 700; }
    .logo-accent { color: #facc15; }
    .nav-links { display: flex; gap: 30px; align-items: center; }
    .nav-links a { color: white; text-decoration: none; font-size: 0.9rem; opacity: 0.8; transition: opacity 0.3s; }
    .nav-links a:hover { opacity: 1; }
    .access-btn {
      padding: 10px 25px;
      background: #facc15;
      color: #064e3b;
      border: none;
      border-radius: 50px;
      font-weight: 700;
      cursor: pointer;
      transition: transform 0.2s, background 0.3s;
    }
    .access-btn:hover { background: #fbbf24; transform: scale(1.05); }

    /* Hero Text */
    .hero-text {
      margin-top: auto;
      margin-bottom: 20%;
      max-width: 700px;
    }
    .hero-text h1 { font-size: 4rem; line-height: 1.1; margin-bottom: 20px; font-weight: 800; }
    .hero-text p { font-size: 1.25rem; opacity: 0.9; margin-bottom: 40px; }
    .btn-main {
      padding: 18px 40px;
      background: #059669;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      margin-right: 20px;
      transition: 0.3s;
    }
    .btn-main:hover { background: #10b981; }
    .btn-sec {
      padding: 18px 40px;
      border: 1px solid rgba(255,255,255,0.4);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      transition: 0.3s;
    }
    .btn-sec:hover { background: rgba(255,255,255,0.1); }

    /* Stats */
    .stats {
      background: white;
      padding: 60px 0;
      display: flex;
      justify-content: center;
      gap: 100px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.05);
      position: relative;
      margin-top: -50px;
      z-index: 5;
      max-width: 1000px;
      margin-left: auto;
      margin-right: auto;
      border-radius: 12px;
    }
    .stat-card { text-align: center; }
    .stat-value { display: block; font-size: 2.5rem; font-weight: 800; color: #064e3b; }
    .stat-label { color: #6b7280; font-size: 0.9rem; margin-top: 5px; }

    /* Sections */
    .section { padding: 100px 20px; background: #f9fafb; }
    .container { max-width: 1200px; margin: 0 auto; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
    .image-box img { width: 100%; border-radius: 20px; box-shadow: 20px 20px 60px rgba(0,0,0,0.1); }
    .subtitle { color: #059669; font-weight: 700; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 2px; }
    .content h2 { font-size: 2.5rem; color: #111827; margin: 15px 0 25px; line-height: 1.2; }
    .features { list-style: none; padding: 0; margin-top: 30px; }
    .features li { padding: 10px 0; font-weight: 500; color: #374151; display: flex; align-items: center; }
    .features li::before { content: "✓"; color: #059669; font-weight: 900; margin-right: 15px; }

    .footer { text-align: center; padding: 40px; background: #111827; color: rgba(255,255,255,0.5); font-size: 0.9rem; }

    /* Animations */
    .animate-up { animation: fadeInUp 1s ease-out; }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 768px) {
      .grid-2 { grid-template-columns: 1fr; }
      .hero-text h1 { font-size: 2.5rem; }
      .nav-links { display: none; }
      .stats { flex-direction: column; gap: 40px; margin-top: -30px; padding: 40px; }
    }
  `]
})
export class LandingPageComponent { }
