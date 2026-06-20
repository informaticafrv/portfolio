<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #333; background: #f9f9f9; margin: 0; padding: 0; }
    .wrapper { max-width: 600px; margin: 2rem auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,.08); }
    .header { background: linear-gradient(135deg, #aa91d6, #8a70bc); padding: 2rem; }
    .header h2 { margin: 0; color: #fff; font-size: 1.3rem; }
    .body { padding: 2rem; }
    .label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: .05em; color: #999; margin: 0 0 .25rem; }
    .value { margin: 0 0 1.5rem; font-size: 0.97rem; color: #222; }
    .message-box { background: #f5f3ff; border-left: 3px solid #aa91d6; padding: 1rem 1.2rem; border-radius: 0 8px 8px 0; white-space: pre-wrap; font-size: 0.95rem; line-height: 1.7; }
    .footer { padding: 1rem 2rem; font-size: 0.75rem; color: #bbb; border-top: 1px solid #eee; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h2>Nuevo mensaje desde el portfolio</h2>
    </div>
    <div class="body">
      <p class="label">Nombre</p>
      <p class="value">{{ $data['name'] }}</p>

      <p class="label">Email</p>
      <p class="value"><a href="mailto:{{ $data['email'] }}" style="color:#8a70bc">{{ $data['email'] }}</a></p>

      <p class="label">Mensaje</p>
      <div class="message-box">{{ $data['message'] }}</div>
    </div>
    <div class="footer">Recibido desde el formulario de contacto del portfolio · franciscoromero.dev</div>
  </div>
</body>
</html>
