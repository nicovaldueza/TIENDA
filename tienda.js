
const LS_ESTADO = 'tienda_estado';
const LS_SESSION = 'tienda_session';

const estadoDefault = () => ({
  valorventastotal: 0, ventamasgrande: 0, cant_ventas_total: 0,
  cant_ventas_altas: 0, mayor_recaudacion: 0, mayor_recaudacion_dia: null,
  producto_ganador: null, historial: []
});

const sessionDefault = () => ({
  activa: false, diasTotal: 0, diaActual: 1,
  cantVentasDia: 0, ventaActual: 1, recaudacionDia: 0
});

let estado = estadoDefault();
let session = sessionDefault();

function guardar() {
  localStorage.setItem(LS_ESTADO, JSON.stringify(estado));
  localStorage.setItem(LS_SESSION, JSON.stringify(session));
}

function cargar() {
  try {
    const e = localStorage.getItem(LS_ESTADO);
    const s = localStorage.getItem(LS_SESSION);
    if (e) estado = JSON.parse(e);
    if (s) session = JSON.parse(s);
  } catch(err) {
    estado = estadoDefault();
    session = sessionDefault();
  }
}

function showSection(s) {
  document.querySelectorAll('.section').forEach(e => e.classList.remove('visible'));
  document.querySelectorAll('.nav-btn').forEach(e => e.classList.remove('active'));
  document.getElementById('section-' + s).classList.add('visible');
  document.getElementById('btn-' + s).classList.add('active');
  if (s === 'estadisticas') renderStats();
}

function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

function iniciarRegistro() {
  const v = parseInt(document.getElementById('input-dias').value);
  const err = document.getElementById('error-dias');
  if (!v || v < 1 || v > 30) { err.style.display = 'block'; return; }
  err.style.display = 'none';
  session = { activa: true, diasTotal: v, diaActual: 1, cantVentasDia: 0, ventaActual: 1, recaudacionDia: 0 };
  guardar();
  document.getElementById('step-dias').style.display = 'none';
  document.getElementById('step-ventas').style.display = 'block';
  document.getElementById('banner-en-curso').classList.remove('show');
  renderChips(); renderDiaForm();
}

function renderChips() {
  const c = document.getElementById('dias-chips');
  c.innerHTML = '';
  for (let i = 1; i <= session.diasTotal; i++) {
    const el = document.createElement('div');
    el.className = 'dia-chip' + (i < session.diaActual ? ' done' : i === session.diaActual ? ' active' : '');
    el.textContent = 'Día ' + i;
    c.appendChild(el);
  }
}

function renderDiaForm() {
  const f = document.getElementById('dia-form');
  f.innerHTML = `
    <div class="card">
      <div class="step-header"><i class="ti ti-sun" aria-hidden="true"></i> Día ${session.diaActual} de ${session.diasTotal} <span class="step-badge">paso 2</span></div>
      <div class="field">
        <label>¿Cuántas ventas se realizaron hoy?</label>
        <input type="number" id="input-cant-ventas" min="0" placeholder="Ej: 3" />
        <div class="error" id="error-cant-ventas">Ingresá 0 o más.</div>
      </div>
      <button class="btn-primary" onclick="confirmarCantVentas()">Continuar</button>
    </div>`;
}

function confirmarCantVentas() {
  const v = parseInt(document.getElementById('input-cant-ventas').value);
  const err = document.getElementById('error-cant-ventas');
  if (isNaN(v) || v < 0) { err.style.display = 'block'; return; }
  err.style.display = 'none';
  session.cantVentasDia = v;
  session.ventaActual = 1;
  session.recaudacionDia = 0;
  estado.cant_ventas_total += v;
  guardar();
  if (v === 0) { finalizarDia(); return; }
  renderVentaForm();
}

function calcularPrecioFinal(precio, cant) {
  const base = precio * cant;
  if (base > 50000) return { final: base * 0.9, nota: 'Descuento 10% por compra > $50.000', tipo: 'discount' };
  if (base < 5000)  return { final: base * 1.05, nota: 'Recargo 5% por compra < $5.000', tipo: 'surcharge' };
  return { final: base, nota: null, tipo: 'normal' };
}

function renderVentaForm() {
  const f = document.getElementById('dia-form');
  f.innerHTML = `
    <div class="card">
      <div class="step-header"><i class="ti ti-tag" aria-hidden="true"></i> Día ${session.diaActual} — Venta ${session.ventaActual} de ${session.cantVentasDia} <span class="step-badge">paso 3</span></div>
      <div class="field">
        <label>Nombre del producto</label>
        <input type="text" id="inp-nombre" placeholder="Ej: Remera azul" />
        <div class="error" id="err-nombre">Ingresá un nombre.</div>
      </div>
      <div class="sale-row">
        <div class="field">
          <label>Precio unitario ($)</label>
          <input type="number" id="inp-precio" min="0.01" step="0.01" placeholder="Ej: 1500" oninput="updatePreview()" />
          <div class="error" id="err-precio">Precio mayor a 0.</div>
        </div>
        <div class="field">
          <label>Cantidad vendida</label>
          <input type="number" id="inp-cant" min="1" placeholder="Ej: 2" oninput="updatePreview()" />
          <div class="error" id="err-cant">Cantidad mayor a 0.</div>
        </div>
      </div>
      <div class="price-preview" id="price-preview">
        <div id="preview-nota"></div>
        <div class="final" id="preview-final"></div>
      </div>
      <button class="btn-primary" onclick="registrarVenta()" style="margin-top:12px">
        ${session.ventaActual < session.cantVentasDia ? 'Registrar y continuar' : 'Registrar última venta'}
      </button>
    </div>`;
}

function updatePreview() {
  const precio = parseFloat(document.getElementById('inp-precio').value);
  const cant   = parseInt(document.getElementById('inp-cant').value);
  const preview = document.getElementById('price-preview');
  if (!precio || !cant || precio <= 0 || cant <= 0) { preview.classList.remove('show'); return; }
  const r = calcularPrecioFinal(precio, cant);
  preview.classList.add('show');
  const badgeHtml = r.tipo !== 'normal' ? `<span class="badge badge-${r.tipo === 'discount' ? 'discount' : 'surcharge'}">${r.nota}</span>` : '';
  document.getElementById('preview-nota').innerHTML = 'Precio final ' + badgeHtml;
  document.getElementById('preview-final').textContent = '$' + r.final.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function registrarVenta() {
  const nombre = document.getElementById('inp-nombre').value.trim();
  const precio = parseFloat(document.getElementById('inp-precio').value);
  const cant   = parseInt(document.getElementById('inp-cant').value);
  let ok = true;
  if (!nombre) { document.getElementById('err-nombre').style.display = 'block'; ok = false; } else document.getElementById('err-nombre').style.display = 'none';
  if (!precio || precio <= 0) { document.getElementById('err-precio').style.display = 'block'; ok = false; } else document.getElementById('err-precio').style.display = 'none';
  if (!cant   || cant   <= 0) { document.getElementById('err-cant').style.display   = 'block'; ok = false; } else document.getElementById('err-cant').style.display   = 'none';
  if (!ok) return;
  const r = calcularPrecioFinal(precio, cant);
  estado.valorventastotal += r.final;
  session.recaudacionDia  += r.final;
  if (r.final > estado.ventamasgrande) { estado.ventamasgrande = r.final; estado.producto_ganador = nombre; }
  if (r.final > 30000) estado.cant_ventas_altas++;
  estado.historial.push({ nombre, precio, cant, final: r.final, dia: session.diaActual });
  session.ventaActual++;
  guardar();
  toast('✓ Venta registrada: ' + nombre);
  if (session.ventaActual > session.cantVentasDia) finalizarDia();
  else renderVentaForm();
}

function finalizarDia() {
  if (session.recaudacionDia > estado.mayor_recaudacion) {
    estado.mayor_recaudacion = session.recaudacionDia;
    estado.mayor_recaudacion_dia = session.diaActual;
  }
  session.diaActual++;
  session.recaudacionDia = 0;
  guardar();
  if (session.diaActual > session.diasTotal) {
    session.activa = false;
    guardar();
    document.getElementById('step-ventas').style.display = 'none';
    document.getElementById('step-dias').style.display = 'block';
    document.getElementById('input-dias').value = '';
    toast('✓ Registro completado. ¡Mirá tus estadísticas!');
    showSection('estadisticas');
    return;
  }
  renderChips(); renderDiaForm();
}

function renderStats() {
  if (estado.cant_ventas_total === 0) {
    document.getElementById('stats-empty').style.display = 'block';
    document.getElementById('stats-content').style.display = 'none';
    return;
  }
  document.getElementById('stats-empty').style.display = 'none';
  document.getElementById('stats-content').style.display = 'block';
  const fmt = v => '$' + v.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById('s-total').textContent           = fmt(estado.valorventastotal);
  document.getElementById('s-mayor').textContent           = fmt(estado.ventamasgrande);
  document.getElementById('s-producto').textContent        = estado.producto_ganador || '—';
  document.getElementById('s-altas').textContent           = estado.cant_ventas_altas;
  document.getElementById('s-promedio').textContent        = fmt(estado.valorventastotal / estado.cant_ventas_total);
  document.getElementById('s-dia-top').textContent         = estado.mayor_recaudacion_dia ? 'Día ' + estado.mayor_recaudacion_dia : '—';
  document.getElementById('s-recaudacion-dia').textContent = fmt(estado.mayor_recaudacion);
  document.getElementById('s-cant-ventas').textContent     = estado.cant_ventas_total;
  document.getElementById('historial-lista').innerHTML = estado.historial.map(v => `
    <div class="venta-item">
      <div><span class="nombre">${v.nombre}</span> <span style="color:var(--text3);font-size:12px">· Día ${v.dia}</span></div>
      <span class="monto">${fmt(v.final)}</span>
    </div>`).join('');
}

function resetear() {
  estado = estadoDefault();
  session = sessionDefault();
  guardar();
  document.getElementById('input-dias').value = '';
  document.getElementById('dias-chips').innerHTML = '';
  document.getElementById('step-ventas').style.display = 'none';
  document.getElementById('step-dias').style.display = 'block';
  document.getElementById('banner-en-curso').classList.remove('show');
  showSection('registro');
  toast('Datos limpiados.');
}

cargar();
if (session.activa) {
  document.getElementById('banner-en-curso').classList.add('show');
  document.getElementById('step-dias').style.display = 'none';
  document.getElementById('step-ventas').style.display = 'block';
  renderChips();
  if (session.ventaActual > session.cantVentasDia || session.cantVentasDia === 0) renderDiaForm();
  else renderVentaForm();
}
