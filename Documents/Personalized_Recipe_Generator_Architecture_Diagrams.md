# Діаграма архітектури системи "Personalized Recipe Generator"
```mermaid
graph TD
    subgraph Frontend [Frontend]
        React[React UI]
    end

    subgraph Backend [Backend]
        SpringBoot[Backend Spring Boot]
        RecipeGen[Recipe Generation Module]
        UserMgmt[User Management Module]
        RecipeMgmt[Recipe Management Module]
        PDFExport[PDF Export Module]
        OpenAI[AI Integration OpenAI API]
        DB[Database PostgreSQL]
    end

    Frontend --> |REST API| Backend

    SpringBoot -.-> RecipeGen
    SpringBoot -.-> UserMgmt
    SpringBoot -.-> RecipeMgmt
    SpringBoot -.-> PDFExport

    RecipeGen --> OpenAI
    UserMgmt --> DB
    RecipeMgmt --> DB
    PDFExport --> DB

    style OpenAI fill:#fcc,stroke:#333,stroke-width:2px
    style DB fill:#fcc,stroke:#333,stroke-width:2px
```