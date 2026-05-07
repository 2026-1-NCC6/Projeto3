import os
from dotenv import load_dotenv
from supabase import create_client, Client
import httpx

# Desabilita verificação de SSL globalmente no httpx para contornar
# firewalls corporativos que interceptam certificados na máquina local.
original_client_init = httpx.Client.__init__
def new_client_init(self, *args, **kwargs):
    kwargs['verify'] = False
    original_client_init(self, *args, **kwargs)
httpx.Client.__init__ = new_client_init

original_async_init = httpx.AsyncClient.__init__
def new_async_init(self, *args, **kwargs):
    kwargs['verify'] = False
    original_async_init(self, *args, **kwargs)
httpx.AsyncClient.__init__ = new_async_init

# Carrega variáveis de ambiente do .env
load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

if not url or not key:
    raise ValueError("As credenciais do Supabase não foram encontradas no .env")

# Cliente Supabase exportado para uso em toda a aplicação
supabase: Client = create_client(url, key)

