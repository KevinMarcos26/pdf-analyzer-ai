# PDF Analyzer AI 📄🤖

Una aplicación web para subir archivos PDF y obtener análisis inteligente impulsado por IA.

## Stack

- **Frontend**: Next.js 16 + React 19
- **Backend**: n8n workflow con OpenAI
- **Tema**: Naranja + Azul Mónaco

## Cómo funciona

1. Sube uno o más archivos PDF arrastrando o haciendo clic
2. Presiona "Enviar para Análisis"
3. La app envía el archivo al webhook de n8n
4. n8n extrae el texto del PDF y lo analiza con OpenAI
5. El resultado se muestra en la interfaz

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Deploy en Netlify

1. Conecta este repo en Netlify
2. Build command: `npm run build`
3. Publish directory: `.next`
4. O usa el plugin `@netlify/plugin-nextjs`
