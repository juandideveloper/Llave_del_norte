export function emailBienvenida(nombre: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"/></head>
    <body style="margin:0;padding:0;background:#fffaec;font-family:sans-serif;">
      <div style="max-width:600px;margin:0 auto;">
        
        <!-- Header -->
        <div style="background:#112221;padding:32px 24px;text-align:center;">
          <h1 style="color:#e1b86b;margin:0;font-size:24px;font-weight:600;">
            La Llave del Norte
          </h1>
          <p style="color:rgba(255,255,255,0.5);margin:8px 0 0;font-size:12px;">
            Ferretería y materiales de construcción
          </p>
        </div>

        <!-- Body -->
        <div style="background:#ffffff;padding:32px 24px;">
          <h2 style="color:#112221;font-size:20px;margin:0 0 16px;">
            ¡Bienvenido, ${nombre}! 👋
          </h2>
          <p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 16px;">
            Nos alegra que seas parte de nuestra comunidad. En La Llave del Norte encontrarás los mejores productos de ferretería y materiales de construcción.
          </p>
          <p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 24px;">
            Ahora puedes explorar nuestro catálogo, hacer pedidos y rastrear tus compras desde tu perfil.
          </p>
          <a href="https://www.lallavedelnorte.com/catalogo"
            style="display:inline-block;background:#112221;color:#e1b86b;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;">
            Ver catálogo
          </a>
        </div>

        <!-- Footer -->
        <div style="background:#f5f5f5;padding:20px 24px;text-align:center;">
          <p style="color:#999;font-size:11px;margin:0;">
            La Llave del Norte · Bogotá, Colombia
          </p>
          <p style="color:#999;font-size:11px;margin:4px 0 0;">
            <a href="https://wa.me/573134866451" style="color:#999;">WhatsApp</a> · 
            <a href="https://www.instagram.com/lallavedelnorte/" style="color:#999;">Instagram</a>
          </p>
        </div>

      </div>
    </body>
    </html>
  `
}

export function emailConfirmacionCompra(
  nombre: string,
  numeroPedido: string,
  total: number,
  direccion: string,
  items: { nombre: string; cantidad: number; precio: number }[]
) {
  const itemsHTML = items.map(item => `
    <tr>
      <td style="padding:8px 0;color:#555;font-size:13px;">${item.nombre}</td>
      <td style="padding:8px 0;color:#555;font-size:13px;text-align:center;">${item.cantidad}</td>
      <td style="padding:8px 0;color:#112221;font-size:13px;text-align:right;font-weight:600;">
        $${(item.precio * item.cantidad).toLocaleString("es-CO")}
      </td>
    </tr>
  `).join("")

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"/></head>
    <body style="margin:0;padding:0;background:#fffaec;font-family:sans-serif;">
      <div style="max-width:600px;margin:0 auto;">

        <!-- Header -->
        <div style="background:#112221;padding:32px 24px;text-align:center;">
          <h1 style="color:#e1b86b;margin:0;font-size:24px;font-weight:600;">
            La Llave del Norte
          </h1>
          <p style="color:rgba(255,255,255,0.5);margin:8px 0 0;font-size:12px;">
            Confirmación de pedido
          </p>
        </div>

        <!-- Body -->
        <div style="background:#ffffff;padding:32px 24px;">
          <h2 style="color:#112221;font-size:20px;margin:0 0 8px;">
            ¡Pedido confirmado! 🎉
          </h2>
          <p style="color:#555;font-size:14px;margin:0 0 24px;">
            Hola ${nombre}, recibimos tu pedido correctamente.
          </p>

          <!-- Número pedido -->
          <div style="background:#fffaec;border:1px solid #e1b86b;border-radius:8px;padding:16px;margin-bottom:24px;">
            <p style="margin:0;color:#112221;font-size:13px;">Número de pedido</p>
            <p style="margin:4px 0 0;color:#112221;font-size:20px;font-weight:700;">
              #${numeroPedido}
            </p>
          </div>

          <!-- Productos -->
          <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
            <thead>
              <tr style="border-bottom:1px solid #f0f0f0;">
                <th style="text-align:left;padding:8px 0;color:#999;font-size:12px;font-weight:500;">Producto</th>
                <th style="text-align:center;padding:8px 0;color:#999;font-size:12px;font-weight:500;">Cant.</th>
                <th style="text-align:right;padding:8px 0;color:#999;font-size:12px;font-weight:500;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>

          <!-- Total -->
          <div style="border-top:2px solid #112221;padding-top:12px;text-align:right;margin-bottom:24px;">
            <p style="margin:0;color:#112221;font-size:16px;font-weight:700;">
              Total: $${total.toLocaleString("es-CO")}
            </p>
          </div>

          <!-- Dirección -->
          ${direccion ? `
          <div style="background:#f9f9f9;border-radius:8px;padding:16px;margin-bottom:24px;">
            <p style="margin:0 0 4px;color:#999;font-size:12px;">Dirección de entrega</p>
            <p style="margin:0;color:#112221;font-size:14px;">${direccion}</p>
          </div>
          ` : ""}

          <a href="https://www.lallavedelnorte.com/perfil/pedidos"
            style="display:inline-block;background:#112221;color:#e1b86b;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;">
            Ver mis pedidos
          </a>
        </div>

        <!-- Footer -->
        <div style="background:#f5f5f5;padding:20px 24px;text-align:center;">
          <p style="color:#999;font-size:11px;margin:0;">
            ¿Tienes preguntas? Escríbenos por 
            <a href="https://wa.me/573134866451" style="color:#112221;">WhatsApp</a>
          </p>
          <p style="color:#999;font-size:11px;margin:4px 0 0;">
            La Llave del Norte · Bogotá, Colombia
          </p>
        </div>

      </div>
    </body>
    </html>
  `
}

export function emailAprobacionCuenta(nombre: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"/></head>
    <body style="margin:0;padding:0;background:#fffaec;font-family:sans-serif;">
      <div style="max-width:600px;margin:0 auto;">

        <div style="background:#112221;padding:32px 24px;text-align:center;">
          <h1 style="color:#e1b86b;margin:0;font-size:24px;font-weight:600;">La Llave del Norte</h1>
        </div>

        <div style="background:#ffffff;padding:32px 24px;">
          <h2 style="color:#112221;font-size:20px;margin:0 0 16px;">
            ¡Tu cuenta mayorista fue aprobada! ✅
          </h2>
          <p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 16px;">
            Hola ${nombre}, nos complace informarte que tu solicitud de cuenta mayorista ha sido aprobada.
          </p>
          <p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 24px;">
            Ahora tienes acceso a precios especiales y puedes realizar importaciones con nosotros.
          </p>
          <a href="https://www.lallavedelnorte.com/catalogo"
            style="display:inline-block;background:#112221;color:#e1b86b;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;">
            Ver precios mayoristas
          </a>
        </div>

        <div style="background:#f5f5f5;padding:20px 24px;text-align:center;">
          <p style="color:#999;font-size:11px;margin:0;">La Llave del Norte · Bogotá, Colombia</p>
        </div>

      </div>
    </body>
    </html>
  `
}

export function emailRechazoCuenta(nombre: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"/></head>
    <body style="margin:0;padding:0;background:#fffaec;font-family:sans-serif;">
      <div style="max-width:600px;margin:0 auto;">

        <div style="background:#112221;padding:32px 24px;text-align:center;">
          <h1 style="color:#e1b86b;margin:0;font-size:24px;font-weight:600;">La Llave del Norte</h1>
        </div>

        <div style="background:#ffffff;padding:32px 24px;">
          <h2 style="color:#112221;font-size:20px;margin:0 0 16px;">
            Actualización sobre tu solicitud
          </h2>
          <p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 16px;">
            Hola ${nombre}, lamentablemente tu solicitud de cuenta mayorista no pudo ser aprobada en este momento.
          </p>
          <p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 24px;">
            Si tienes preguntas o quieres más información, no dudes en contactarnos.
          </p>
          <a href="https://wa.me/573134866451"
            style="display:inline-block;background:#112221;color:#e1b86b;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;">
            Contactar por WhatsApp
          </a>
        </div>

        <div style="background:#f5f5f5;padding:20px 24px;text-align:center;">
          <p style="color:#999;font-size:11px;margin:0;">La Llave del Norte · Bogotá, Colombia</p>
        </div>

      </div>
    </body>
    </html>
  `
}