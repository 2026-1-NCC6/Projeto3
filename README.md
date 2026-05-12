# FECAP - Fundação de Comércio Álvares Penteado

<p align="center">
<a href= "https://www.fecap.br/"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhZPrRa89Kma0ZZogxm0pi-tCn_TLKeHGVxywp-LXAFGR3B1DPouAJYHgKZGV0XTEf4AE&usqp=CAU" alt="FECAP - Fundação de Comércio Álvares Penteado" border="0"></a>
</p>

# Sistema Inteligente de Gestão de Energia (SIGE)

## Núcleo Tech

## Integrantes: <a href="https://www.linkedin.com/in/mariaeflopes/">Eduarda Lopes</a>, <a href="https://www.linkedin.com/in/flaviojose-santos/">Flávio Santos</a>, <a href="https://www.linkedin.com/in/jeniferjacinobarreto/">Jenifer Jacino Barreto</a>, <a href="https://www.linkedin.com/in/felipecarpal/">Felipe Carvalho Paleari</a>

## Professores Orientadores: <a href="https://www.linkedin.com/in/victorbarq/">Victor Bruno Alexander Rosetti de Quiroz</a>, <a href="https://www.linkedin.com/in/professorrodnil/">Rodnil da Silva Moreira Lisboa</a>, <a href="https://www.linkedin.com/in/lucymari/">Lucy Mari Tabuti</a>, <a href="https://www.linkedin.com/in/trencher/">Joao Francisco Trencher Martins</a>, <a href="https://www.linkedin.com/in/edsonbarbero/">Edson Ricardo Barbero</a>

## Descrição

<p align="center">
<img src="https://github.com/2026-1-NCC6/Projeto3/blob/main/imagens/logoR.png" alt="SIGE" border="0">
<br> <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a> 
</p>


O Sistema Inteligente de Gestão de Energia (SIGE) é uma solução estratégica voltada para o mercado de eficiência e segurança energética, desenvolvida para atender consumidores residenciais, proprietários de imóveis e pequenos comércios.  
<br>
A plataforma resolve dores críticas ao oferecer monitoramento de consumo em tempo real para facilitar a redução de gastos e atuar na prevenção ativa de incêndios, realizando o corte automático de energia em casos de sobrecarga.
<br><br>

## 🛠 Estrutura de pastas

-Raiz<br>
|<br>
|-->documentos<br>
  &emsp;|-->Entrega 1<br>
  &emsp;|-->Banner<br>
    &emsp;&emsp;|-->Inovação e Empreendedorismo<br>
    &emsp;&emsp;|-->Projeto Interdisciplinar | Internet das Coisas e Robótica<br>
    &emsp;&emsp;|-->Redes de Computadores e Cibersegurança<br>
    &emsp;&emsp;|-->Sistemas Embarcados e Robótica<br>
    &emsp;&emsp;|-->Teoria da Computação e Linguagens Formais<br>
  &emsp;|-->Entrega 2<br>
    &emsp;&emsp;|-->Inovação e Empreendedorismo<br>
    &emsp;&emsp;|-->Projeto Interdisciplinar | Internet das Coisas e Robótica<br>
    &emsp;&emsp;|-->Redes de Computadores e Cibersegurança<br>
    &emsp;&emsp;|-->Sistemas Embarcados e Robótica<br>
    &emsp;&emsp;|-->Teoria da Computação e Linguagens Formais<br>
  &emsp;|Documento - Projeto de Extensão - COM Empresa.docx<br>
  &emsp;|readme.md<br>
  &emsp;|-->Entrega 1<br>
    &emsp;&emsp;|-->Backend<br>
    &emsp;&emsp;|-->Frontend<br>
  &emsp;|-->Entrega 2<br>
    &emsp;&emsp;|-->Backend<br>
    &emsp;&emsp;|-->Frontend<br>
|readme.md<br>

O projeto integra conceitos de:

- Internet das Coisas (IoT)
- Sistemas Embarcados
- Automação
- Cibersegurança
- Monitoramento em Tempo Real
- Computação em Nuvem
- Eficiência Energética

---

## ⚡ Funcionalidades

- Monitoramento de tensão elétrica
- Monitoramento de corrente elétrica
- Cálculo de potência
- Cálculo de consumo energético (kWh)
- Dashboard administrativo
- Dashboard do cliente
- Sistema de alertas inteligentes
- Desligamento automático por sobrecarga
- Comunicação entre Arduino e ESP32
- Integração com banco de dados em nuvem
- Controle remoto de dispositivos
- Histórico de consumo energético
- Monitoramento em tempo real

---

## 🧠 Arquitetura do Sistema

```text
Sensores → Arduino UNO → ESP32 → Supabase → Dashboard Web/Mobile
```

### Fluxo do sistema

1. Os sensores realizam a leitura da corrente e tensão elétrica.
2. O Arduino processa os dados utilizando filtros e cálculos RMS.
3. O ESP32 recebe os dados via comunicação serial.
4. O ESP32 envia as informações para o Supabase utilizando Wi-Fi.
5. O dashboard exibe os dados em tempo real.
6. O sistema gera alertas automáticos e pode desligar cargas elétricas através do módulo relé.

---

## 🛠 Tecnologias Utilizadas

### Hardware

- Arduino UNO
- ESP32
- Sensor ACS712
- Sensor de tensão AC
- Módulo Relé
- Protoboard
- Jumpers

### Software

- C++
- Arduino IDE
- JavaScript
- React
- Vite
- Supabase
- HTML5
- CSS3

---

## 💻 Configuração do Ambiente

### 1. Instalar Arduino IDE

Download:

https://www.arduino.cc/en/software

---

### 2. Instalar suporte ESP32

Adicionar URL:

```text
https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
```

Caminho:

```text
Arquivo → Preferências → URLs adicionais para Gerenciadores de Placas
```

---

### 3. Instalar bibliotecas

Na Arduino IDE:

```text
Ferramentas → Gerenciar Bibliotecas
```

Instalar:

- WiFi
- HTTPClient

---

## ☁ Configuração do Supabase

### Criar projeto

https://supabase.com

---

### Criar tabela de leituras

```sql
create table leituras (

  id bigint generated always as identity primary key,

  tensao numeric(10,2),

  corrente numeric(10,3),

  potencia numeric(10,2),

  energia_kwh numeric(12,6),

  created_at timestamp with time zone default now()
);
```

---

## 🚀 Instalação

### Backend

Instalar dependências:

```bash
npm install
```

Executar ambiente:

```bash
npm run dev
```

---

### Frontend

Instalar dependências:

```bash
npm install
```

Executar ambiente:

```bash
npm run dev
```

Build de produção:

```bash
npm run build
```

---

## 🔥 Alertas Inteligentes

O SIGE identifica automaticamente:

- Sobrecarga elétrica
- Queda de tensão
- Consumo anormal
- Dispositivos offline
- Falhas de comunicação

---

## 🔒 Segurança

O sistema implementa:

- Comunicação estruturada
- Validação de checksum
- Filtros de ruído
- Reconexão Wi-Fi
- Mitigação de falhas elétricas
- Desligamento automático preventivo

---

## 📊 Dashboard

O sistema possui:

## Dashboard Administrativo

- Clientes ativos
- Dispositivos online/offline
- Alertas em tempo real
- Métricas globais
- Consumo energético total

## Dashboard do Cliente

- Consumo em tempo real
- Histórico energético
- Alertas personalizados
- Controle remoto de dispositivos

---

## 🛣 Roadmap

## Futuras Implementações

- Aplicativo mobile
- Inteligência Artificial
- Machine Learning
- MQTT
- Relatórios automáticos
- Integração com assistentes virtuais
- Sistema multiusuário
- Previsão de consumo energético

---

## 📋 Licença/License
<a href="https://github.com/2026-1-NCC6/Projeto3">SIGE</a> © 2026 by <a href="https://github.com/FreitasLopes">Eduarda Lopes, Jenifer Barreto, Flavio Santos, Felipe Paleari</a> is licensed under <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a><img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" alt="" style="max-width: 1em;max-height:1em;margin-left: .2em;"><img src="https://mirrors.creativecommons.org/presskit/icons/by.svg" alt="" style="max-width: 1em;max-height:1em;margin-left: .2em;">

# 🎓 Referências

## Documentações Oficiais

1. Arduino. Arduino Documentation. Disponível em:
https://docs.arduino.cc/

2. Espressif Systems. ESP32 Documentation. Disponível em:
https://docs.espressif.com/projects/esp-idf/en/latest/esp32/

3. Supabase. Supabase Documentation. Disponível em:
https://supabase.com/docs

4. React. React Documentation. Disponível em:
https://react.dev/

5. Vite. Vite Documentation. Disponível em:
https://vitejs.dev/

---

## Sensores e Componentes

6. Allegro Microsystems. ACS712 Fully Integrated Hall Effect Current Sensor IC. Disponível em:
https://www.allegromicro.com/en/products/sense/current-sensor-ics/integrated-current-sensors/acs712

7. Datasheet ESP32-WROOM-32. Disponível em:
https://www.espressif.com/sites/default/files/documentation/esp32-wroom-32_datasheet_en.pdf

8. Arduino UNO Rev3 Datasheet. Disponível em:
https://docs.arduino.cc/resources/datasheets/A000066-datasheet.pdf

---

## Conceitos Técnicos

9. Horowitz, Paul; Hill, Winfield. The Art of Electronics. 3rd Edition. Cambridge University Press, 2015.

10. Stallings, William. Computer Networks. Pearson, 2013.

11. Tanenbaum, Andrew S.; Wetherall, David. Computer Networks. Pearson, 2011.

12. Sommerville, Ian. Software Engineering. Pearson, 2019.

13. Pressman, Roger S.; Maxim, Bruce R. Software Engineering: A Practitioner's Approach. McGraw-Hill, 2020.

---

## Segurança e IoT

14. OWASP Foundation. OWASP Internet of Things Project. Disponível em:
https://owasp.org/www-project-internet-of-things/

15. NIST. Considerations for Managing Internet of Things (IoT) Cybersecurity and Privacy Risks. Disponível em:
https://csrc.nist.gov/publications/detail/nistir/8228/final

---

## Desenvolvimento e Organização

16. GitHub Docs. Disponível em:
https://docs.github.com/

17. Toptal Gitignore Generator. Disponível em:
https://www.toptal.com/developers/gitignore

18. iuricode/readme-template. Disponível em:
https://github.com/iuricode/readme-template

19. gabrieldejesus/readme-model. Disponível em:
https://github.com/gabrieldejesus/readme-model
