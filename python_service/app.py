from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import google.generativeai as genai
from dotenv import load_dotenv
import traceback
import sys

# --- PARCHE PARA WINDOWS ---
try:
    sys.stdout.reconfigure(encoding='utf-8')
except AttributeError:
    pass

# 1. Cargar variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# 2. Configurar API
api_key = os.getenv('GEMINI_API_KEY')

if not api_key:
    print("❌ [ERROR CRITICO]: Faltan las credenciales en .env")
else:
    genai.configure(api_key=api_key)
    print("✨ [INFO] Gemini API Configurada")

# --- LÓGICA DE SELECCIÓN DE MODELO ---
# Intentaremos estos modelos en orden hasta que uno funcione.
# "gemini-2.5-flash" es el nombre oficial actual del modelo rápido.
# Si tienes acceso a una beta privada como la 2.5, se añadiría aquí.
MODELOS_DISPONIBLES = [
    'gemini-2.5-flash',       # El rápido (Tu favorito)
    'gemini-2.5-flash-exp',   # El experimental nuevo
    'gemini-1.5-pro',         # El potente
    'gemini-pro'              # La vieja confiable (Respaldo final)
]

def generar_respuesta_inteligente(prompt):
    """Prueba modelos en orden hasta que uno responda"""
    errores = []
    
    for nombre_modelo in MODELOS_DISPONIBLES:
        try:
            print(f"🔵 Intentando generar con modelo: {nombre_modelo}...")
            model = genai.GenerativeModel(nombre_modelo)
            response = model.generate_content(prompt)
            
            if response.parts:
                return response.text, nombre_modelo
            else:
                print(f"⚠️ El modelo {nombre_modelo} bloqueó la respuesta.")
                
        except Exception as e:
            # Si falla (ej: 404 not found), guardamos el error y probamos el siguiente
            print(f"🔸 Falló {nombre_modelo}: {str(e)}")
            errores.append(f"{nombre_modelo}: {str(e)}")
            continue
            
    # Si llegamos aquí, fallaron todos
    raise Exception(f"Ningún modelo respondió. Detalles: {errores}")

@app.route('/', methods=['GET'])
def home():
    return "Cerebro IA GamerVision: ONLINE"

@app.route('/api/chat', methods=['POST'])
def chat_endpoint():
    print("📩 [Python] Recibiendo petición...")
    try:
        data = request.get_json(force=True, silent=True)
        mensaje_usuario = data.get('mensaje', '')

        if not mensaje_usuario:
            return jsonify({"error": "Mensaje vacío"}), 400

        prompt_sistema = f"""
        Eres 'VisionBot', experto en hardware y gaming de GamerVision.
        Responde corto, útil y con estilo gamer.
        Pregunta: {mensaje_usuario}
        """

        # Usamos la función inteligente de respaldo
        respuesta_texto, modelo_usado = generar_respuesta_inteligente(prompt_sistema)
        
        print(f"🤖 [EXITO] Respuesta generada con {modelo_usado}")

        return jsonify({
            "autor": f"VisionBot ({modelo_usado})",
            "analisis": respuesta_texto
        })

    except Exception as e:
        print("\n❌ [Python ERROR FATAL]:")
        traceback.print_exc()
        return jsonify({"error": "Error de IA", "detalle": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)