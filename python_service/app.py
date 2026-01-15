from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import traceback 

# Cargar variables de entorno
load_dotenv()

app = Flask(__name__)
# Permitir CORS para que Node pueda hablarle sin problemas
CORS(app)

@app.route('/', methods=['GET'])
def home():
    return "Servicio de Python GamerVision operando correctamente."

@app.route('/api/chat', methods=['POST'])
def chat_endpoint():
    print("[Python] Peticion recibida en /api/chat") # Log de entrada (Sin emojis)
    try:
        # force=True ayuda si Node no mandó bien el header 'application/json'
        data = request.get_json(force=True, silent=True)
        
        if not data:
            print("[Python WARN] El cuerpo del mensaje llego vacio.")
            return jsonify({"error": "No enviaste datos JSON"}), 400
            
        mensaje_usuario = data.get('mensaje', '')
        print(f"[Python] Mensaje descifrado: {mensaje_usuario}")

        # Respuesta simulada (Aquí luego pondremos a Gemini)
        respuesta_simulada = {
            "autor": "Python AI Module",
            "analisis": f"He recibido tu mensaje correctamente: '{mensaje_usuario}'",
            "recomendacion": "Conexion arreglada. Ya no hay error de codificacion."
        }

        return jsonify(respuesta_simulada)

    except Exception as e:
        # Aquí capturamos el error real y lo imprimimos en tu terminal negra
        print("\n[Python ERROR CRITICO]:")
        print(traceback.format_exc())
        return jsonify({"error": str(e), "ubicacion": "python_service"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)