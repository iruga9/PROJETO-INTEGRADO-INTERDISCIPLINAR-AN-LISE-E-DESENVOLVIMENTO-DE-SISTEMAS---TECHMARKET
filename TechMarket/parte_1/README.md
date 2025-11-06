# 🏗️ TechMarket - Escalonamento em Nuvem (Passo 1 - Projeto Integrado)

## 📘 Contexto

A **TechMarket**, especializada em e-commerce, enfrenta sérios desafios de desempenho durante períodos de alta demanda — como a **Black Friday** e promoções-relâmpago. O sistema atual, baseado em uma **arquitetura monolítica** com **escalonamento vertical limitado**, não acompanha o crescimento do número de requisições simultâneas, gerando falhas, lentidão e perdas financeiras.

**Principais problemas identificados:**
- Falhas recorrentes durante horários de pico  
- Latência elevada (> 5 segundos) em transações financeiras  
- Escalonamento apenas vertical  
- Banco de dados sobrecarregado e sem otimizações  
- Frontend não responsivo em dispositivos móveis (40% do tráfego)  
- Falta de resiliência – falhas em SP afetam todo o país  
- Sessões não persistentes, causando repetição de operações  
- Ausência de monitoramento em tempo real  
- Custos explosivos com infraestrutura ineficiente  

💸 **Impacto estimado:** R$ 2,1 milhões por hora de indisponibilidade, além de risco de multas regulatórias.

---

## 🧠 Diferença entre Escalonamento Vertical e Horizontal

| Tipo | Descrição | Vantagens | Desvantagens |
|------|------------|------------|---------------|
| **Vertical (Scale Up)** | Aumentar os recursos de um único servidor (CPU, memória, armazenamento) | Simples de implementar; não exige mudanças na arquitetura | Possui limite físico; único ponto de falha; custo alto; downtime durante upgrade |
| **Horizontal (Scale Out)** | Adicionar mais instâncias da aplicação, distribuindo a carga entre elas | Alta disponibilidade; tolerância a falhas; escalabilidade quase infinita | Exige que a aplicação seja *stateless*; requer balanceador de carga e sincronização |

---

## ☁️ Proposta Técnica: Escalonamento Horizontal em Nuvem

### 🎯 Objetivo
Migrar a TechMarket de uma arquitetura monolítica para uma **arquitetura distribuída e escalável**, utilizando **containers, Kubernetes e computação em nuvem**, permitindo que a aplicação suporte grandes volumes de acesso com **baixa latência e alta disponibilidade**.

---

### 🧩 Componentes Principais da Solução

#### 1. **Arquitetura Containerizada**
- Transformar a aplicação em **containers Docker**.
- Orquestrar via **Kubernetes (K8s)**.
- Implementar **Horizontal Pod Autoscaler (HPA)** para escalar automaticamente com base em uso de CPU/memória ou latência.

#### 2. **Balanceamento de Carga e Gateway**
- Utilizar **Load Balancer (ALB/NLB)** para distribuir o tráfego.
- Usar **Ingress Controller (Nginx ou Traefik)** para roteamento inteligente e HTTPS.

#### 3. **Sessões e Cache**
- Tornar a aplicação **stateless**: armazenar sessões no **Redis**.
- Implementar **cache** de consultas frequentes (Redis ou Memcached).

#### 4. **Banco de Dados Escalável**
- Migrar para **banco gerenciado (RDS/Aurora)** com **read replicas** para leitura pesada.
- Otimizar consultas SQL e criar índices.
- Habilitar **multi-AZ** para alta disponibilidade e **backups automáticos**.

#### 5. **Fila de Mensagens e Processamento Assíncrono**
- Adotar **RabbitMQ** ou **Apache Kafka** para filas.
- Desacoplar operações pesadas (ex: relatórios, notas fiscais, conciliação de pagamentos).

#### 6. **Monitoramento e Observabilidade**
- Expor métricas com **Prometheus** e visualizar no **Grafana**.
- Centralizar logs com **ELK/EFK Stack**.
- Implementar tracing distribuído com **Jaeger**.
- Criar alertas automáticos via Slack ou e-mail.

---

## ⚙️ Exemplo de Configuração (Kubernetes)

### 📄 `deployment.yaml`
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: techmarket-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: techmarket-api
  template:
    metadata:
      labels:
        app: techmarket-api
    spec:
      containers:
      - name: api
        image: registry.example.com/techmarket-api:latest
        ports:
        - containerPort: 3000
        resources:
          requests:
            cpu: "100m"
            memory: "256Mi"
          limits:
            cpu: "1000m"
            memory: "1Gi"
        livenessProbe:
          httpGet:
            path: /healthz
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 20
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 10
```

### ⚡ `hpa.yaml`
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: techmarket-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: techmarket-api
  minReplicas: 3
  maxReplicas: 50
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 60
```

### 🔗 Balanceador de Carga
```bash
kubectl expose deployment techmarket-api --type=LoadBalancer --port=80 --target-port=3000
```

---

## 🧭 Plano de Migração

1. **Containerizar** a aplicação e configurar CI/CD (GitHub Actions / GitLab CI).  
2. **Implantar** ambiente de staging em Kubernetes (com Redis e banco de dados gerenciado).  
3. **Migrar sessões** para Redis, garantindo que a aplicação seja stateless.  
4. **Adicionar read replicas** e otimizar consultas SQL.  
5. **Implementar filas** para processamento assíncrono.  
6. **Ativar monitoramento** e métricas Prometheus/Grafana.  
7. **Realizar testes de carga** (k6 ou Locust).  
8. **Habilitar autoscaling automático** e deploy progressivo (canary release).  

---

## 📈 Benefícios Esperados

| Benefício | Descrição |
|------------|------------|
| **Alta Disponibilidade** | A aplicação permanecerá online mesmo com falhas regionais |
| **Escalabilidade Dinâmica** | Novas instâncias são criadas automaticamente conforme a demanda |
| **Redução de Latência** | Redis + Read Replicas aliviam a sobrecarga no banco principal |
| **Resiliência** | Falhas isoladas não comprometem o sistema |
| **Custos Otimizados** | Uso de instâncias sob demanda e spot reduz custos operacionais |
| **Conformidade BACEN** | Multi-AZ e monitoramento contínuo garantem aderência às normas |

---

## 🛠️ Ferramentas Recomendadas

| Categoria | Ferramenta |
|------------|-------------|
| Containers | Docker |
| Orquestração | Kubernetes (EKS, GKE ou AKS) |
| Balanceamento | NGINX Ingress / Cloud Load Balancer |
| Sessões / Cache | Redis |
| Banco de Dados | AWS RDS / Aurora com Read Replicas |
| Filas | RabbitMQ / Kafka |
| Observabilidade | Prometheus, Grafana, ELK/EFK, Jaeger |
| CI/CD | GitHub Actions / GitLab CI |
| Testes de Carga | k6 / Locust |

---

## 🧩 Exemplo de Comando de Escalonamento

```bash
kubectl autoscale deployment techmarket-api --cpu-percent=60 --min=3 --max=50
```

---

## 📊 Conclusão

A proposta de **escalonamento horizontal em nuvem** permite que a **TechMarket** alcance **alta disponibilidade, resiliência e desempenho**, reduzindo o impacto financeiro causado por indisponibilidades e falhas.  
A adoção de **Kubernetes**, **Redis**, **bancos com réplicas** e **monitoramento contínuo** garante que o sistema suporte grandes picos de tráfego, como a Black Friday, com **segurança, eficiência e conformidade regulatória**.

---

📅 **Projeto Integrado - Passo 1: Computação em Nuvem**  
👨‍💻 Autor: HAMILTON OLIVEIRA TEIXEIRA 
🏢 Curso: Anhanguera - Projeto TechMarket  
📂 Repositório: https://github.com/iruga9/PROJETO-INTEGRADO-INTERDISCIPLINAR-AN-LISE-E-DESENVOLVIMENTO-DE-SISTEMAS---TECHMARKET/tree/main 
