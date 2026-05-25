# SPL Integrado — Frontend React + Backend Flask

Este pacote já vem com o frontend conectado ao backend Flask.

## 1. Rodar o backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

O backend deve ficar em:

```txt
http://127.0.0.1:5000
```

## 2. Rodar o frontend

Abra outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O frontend deve abrir em:

```txt
http://localhost:5173
```

## Observações

- O cadastro agora pede CPF, porque o backend exige CPF obrigatório.
- A senha precisa ter no mínimo 8 caracteres, conforme validação do backend.
- Login, cadastro, triagem e dashboard usam a API real.
- A documentação do backend fica em `http://localhost:5000/docs`.
