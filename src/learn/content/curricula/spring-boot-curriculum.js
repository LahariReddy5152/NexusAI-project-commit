import { buildLesson } from "../lesson-builder.js";

export const SPRING_BOOT_CURRICULUM = [
  buildLesson({
    title: "Spring Boot Setup",
    description: "Projects, starters, auto-configuration, and application structure",
    difficulty: "Beginner",
    duration: "25 min",
    codeLang: "java",
    overview: "Spring Boot accelerates Java service development with opinionated defaults, starter dependencies, and embedded servers. This lesson covers project bootstrap, application.yml, and the core @SpringBootApplication entry point.",
    theory: "Spring Boot builds on the Spring Framework IoC container. Auto-configuration inspects classpath and configures beans conditionally. Starters bundle transitive dependencies (spring-boot-starter-web, data-jpa, security). Embedded Tomcat/Jetty removes external server deployment for dev and containers.",
    explanation: "Create projects via start.spring.io or IDE. Structure code into controllers, services, repositories, and config packages. Externalize settings in application.properties/yml and profiles (dev, prod).",
    realWorldExample: "Teams scaffold microservices in minutes with spring-boot-starter-web + actuator + validation, deploy as fat JARs to Kubernetes.",
    architectureDiagram: `┌─────────────────────────────────────┐\n│     @SpringBootApplication          │\n│  ┌─────────┐  ┌─────────┐          │\n│  │ Auto-   │  │ Starters│          │\n│  │ Config  │  │ (web,   │          │\n│  └────┬────┘  │  data)  │          │\n│       ▼         └────┬────┘          │\n│   Spring Context     │              │\n└──────────────────────┼──────────────┘\n                       ▼\n              Embedded Tomcat`,
    flowDiagram: `start.spring.io → Add starters → @SpringBootApplication → Component scan → Auto-config → Run Application`,
    syntax: `@SpringBootApplication\npublic class ApiApplication {\n  public static void main(String[] args) {\n    SpringApplication.run(ApiApplication.class, args);\n  }\n}`,
    practicalExample: `// build.gradle\n// implementation 'org.springframework.boot:spring-boot-starter-web'\n@RestController\npublic class HealthController {\n  @GetMapping("/health")\n  public Map<String, String> health() {\n    return Map.of("status", "UP");\n  }\n}`,
    bestPractices: ["Use meaningful package-by-feature or layer structure", "Externalize secrets via env vars", "Enable spring-boot-starter-actuator for health", "Pin Boot version in BOM"],
    commonMistakes: ["Putting business logic in controllers", "Committing secrets to application.yml", "Disabling component scan with wrong base package"],
    exercise: "Bootstrap a Boot app with web + devtools. Add /api/version returning build info.",
    assignment: "Configure dev and prod profiles with different datasource URLs (H2 vs PostgreSQL).",
    miniProject: "Create a Task API skeleton: entity, repository, service, controller packages with health endpoint.",
    quizQuestions: [
      { question: "@SpringBootApplication combines:", options: ["Only @Controller", "@Configuration + @EnableAutoConfiguration + @ComponentScan", "@Repository only", "@Sql"], correct: 1 },
      { question: "Starters are:", options: ["UI themes", "Dependency bundles", "SQL scripts", "Docker files"], correct: 1 }
    ],
    interviewQuestions: ["What is Spring Boot auto-configuration?", "Fat JAR vs WAR deployment?"],
    summary: "Spring Boot removes boilerplate so you focus on business logic. Learn starters, profiles, and package structure first.",
    resources: ["spring.io/guides", "Spring Boot reference docs", "start.spring.io"]
  }),
  buildLesson({
    title: "REST Controllers",
    description: "HTTP mapping, DTOs, validation, and request lifecycle",
    difficulty: "Intermediate",
    duration: "35 min",
    codeLang: "java",
    overview: "REST controllers expose HTTP APIs in Spring Boot. This lesson covers the request lifecycle, @RestController mapping, DTOs, validation, status codes, and layering with services and repositories.",
    theory: "DispatcherServlet routes HTTP requests to @RequestMapping handlers. Controllers should be thin—delegate to services. DTOs decouple API contracts from JPA entities. @Valid triggers Bean Validation (JSR-380). Exception handlers (@ControllerAdvice) map errors to consistent JSON.",
    explanation: "Request lifecycle: Tomcat → DispatcherServlet → HandlerMapping → Controller → Service → Repository → DB → response serialization (Jackson). Use proper HTTP verbs and status codes (201 Created, 404 Not Found, 400 Bad Request).",
    realWorldExample: "E-commerce APIs expose POST /orders, GET /orders/{id}, and PATCH /orders/{id}/status with OAuth2 security and OpenAPI docs.",
    architectureDiagram: `Client HTTP\n    │\n    ▼\nDispatcherServlet\n    │\n    ▼\n@RestController ──► @Service ──► @Repository ──► Database\n    │                    │\n    ▼                    ▼\n  JSON DTO           Business rules`,
    flowDiagram: `HTTP request → Controller validates DTO → Service transaction → Repository persist → Map to response DTO → JSON response`,
    syntax: `@RestController\n@RequestMapping("/api/users")\npublic class UserController {\n  @PostMapping\n  public ResponseEntity<UserDto> create(@Valid @RequestBody CreateUserRequest req) {\n    return ResponseEntity.status(201).body(service.create(req));\n  }\n}`,
    practicalExample: `@GetMapping("/{id}")\npublic UserDto get(@PathVariable Long id) {\n  return userService.findById(id);\n}\n\n@ExceptionHandler(NotFoundException.class)\npublic ResponseEntity<?> notFound(NotFoundException ex) {\n  return ResponseEntity.status(404).body(Map.of("error", ex.getMessage()));\n}`,
    bestPractices: ["Version APIs (/api/v1)", "Use DTOs not entities in JSON", "Validate input at boundary", "Document with OpenAPI/Springdoc"],
    commonMistakes: ["Returning entities with lazy-loaded relations (serialization errors)", "Missing @Valid on request bodies", "500 for business rule violations instead of 4xx"],
    exercise: "Add CRUD endpoints for a Product resource with validation on name and price.",
    assignment: "Implement global exception handler returning Problem Details JSON for validation errors.",
    miniProject: "Build REST API for a bookstore: books CRUD, search by author, pagination with Pageable.",
    quizQuestions: [
      { question: "@RestController equals @Controller + :", options: ["@Transactional", "@ResponseBody", "@Repository", "@Sql"], correct: 1 },
      { question: "201 Created is used for:", options: ["GET success", "Successful POST creating resource", "Errors", "DELETE always"], correct: 1 }
    ],
    interviewQuestions: [
      "Walk through Spring MVC request lifecycle.",
      "How do you handle validation errors consistently?",
      "Controller vs @ControllerAdvice responsibilities?"
    ],
    summary: "REST controllers are the HTTP boundary—keep them thin, validate early, map errors clearly, and layer services for business logic.",
    resources: ["Spring Web MVC docs", "RFC 7807 Problem Details", "springdoc-openapi"]
  })
];

const SPRING_EXTENDED = [
  {
    title: "Dependency Injection",
    overview: "Dependency Injection (DI) wires objects through the Spring container instead of manual construction—enabling testability, loose coupling, and clear lifecycle management.",
    theory: "Spring IoC container creates and injects beans. Constructor injection is preferred (immutable dependencies, easy testing). @Autowired on constructor is optional since Spring 4.3 for single constructors. @Component, @Service, @Repository stereotype beans for scanning.",
    explanation: "Define interfaces for collaborators; inject implementations via constructor. Use @Configuration + @Bean for third-party objects. @Profile activates beans per environment. Testing: @MockBean replaces beans in slice tests.",
    realWorldExample: "OrderService receives PaymentGateway and InventoryClient via constructor—swap mock gateways in @WebMvcTest without changing production code.",
    architectureDiagram: `@Configuration / ComponentScan\n        │\n        ▼\n   BeanFactory\n        │\n   inject ▼\n @Service OrderService ──► OrderRepository`,
    flowDiagram: `Define beans → Container starts → Resolve dependencies → Inject → Ready for requests`,
    syntax: `@Service\npublic class OrderService {\n  private final OrderRepository repo;\n  public OrderService(OrderRepository repo) { this.repo = repo; }\n}`,
    practicalExample: `@TestConfiguration\nstatic class TestConfig {\n  @Bean OrderRepository repo() { return Mockito.mock(OrderRepository.class); }\n}`,
    exercise: "Refactor a class using `new` for dependencies to constructor injection with interfaces.",
    assignment: "Write unit tests for a service using @ExtendWith(MockitoExtension.class) and mocked repos.",
    miniProject: "Task service with TaskRepository interface, JPA impl, and in-memory fake for tests.",
    quiz: [
      { question: "Preferred injection style in Spring:", options: ["Field only", "Constructor", "Static setter", "Reflection manual"], correct: 1 },
      { question: "@Service is a stereotype for:", options: ["Business layer beans", "SQL scripts", "HTML", "JWT only"], correct: 0 }
    ],
    interview: ["Constructor vs field injection?", "How does @MockBean work?", "What is bean scope?"]
  },
  {
    title: "JPA Integration",
    overview: "Spring Data JPA maps Java entities to relational tables and provides repository abstractions—reducing JDBC boilerplate while keeping transaction control.",
    theory: "@Entity classes map to tables; @Id @GeneratedValue for keys. JpaRepository adds CRUD + pagination. Lazy loading fetches relations on access; N+1 risk in loops. @Transactional defines unit of work at service layer.",
    explanation: "Keep entities out of REST JSON—map to DTOs. Use fetch joins or @EntityGraph for eager needs. Flyway/Liquibase version schema. Open-in-view disabled in production APIs to avoid lazy loads in rendering.",
    realWorldExample: "Catalog microservice exposes ProductDto from Product entity via service layer; repository handles findByCategory with Pageable.",
    architectureDiagram: `Controller → Service @Transactional → JpaRepository → Hibernate → DB`,
    flowDiagram: `HTTP → DTO → Service maps to entity → Repository save → Flush → Response DTO`,
    syntax: `@Entity public class User { @Id @GeneratedValue private Long id; private String email; }\npublic interface UserRepository extends JpaRepository<User, Long> {\n  Optional<User> findByEmail(String email);\n}`,
    practicalExample: `@Transactional\npublic UserDto create(CreateUserRequest req) {\n  User u = new User(); u.setEmail(req.email());\n  return UserDto.from(repo.save(u));\n}`,
    exercise: "Add pagination endpoint GET /products?page=0&size=20 using Page<Product>.",
    assignment: "Fix an N+1 query using join fetch or @EntityGraph; show EXPLAIN before/after.",
    miniProject: "Blog API: Post, Author entities, repositories, and transactional publish workflow.",
    quiz: [
      { question: "@Transactional belongs primarily on:", options: ["Controllers always", "Service layer", "Entities", "DTOs"], correct: 1 },
      { question: "LazyInitializationException often means:", options: ["Session closed before access", "Invalid JSON", "Wrong HTTP verb", "Missing CSS"], correct: 0 }
    ],
    interview: ["JPA vs JDBC tradeoffs?", "What is N+1 and fixes?", "DTO vs entity in APIs?"]
  },
  {
    title: "Spring Security",
    overview: "Spring Security protects endpoints with authentication, authorization, CSRF defenses, and OAuth2/JWT integration for production APIs.",
    theory: "SecurityFilterChain defines HTTP security rules. AuthenticationManager validates credentials; UserDetailsService loads users. JWT: stateless bearer tokens signed with secret/key. Method security @PreAuthorize for fine-grained checks.",
    explanation: "Order matters in filter chain. Permit health/actuator publicly; secure /api/**. Use BCrypt for password hashing. CORS configured explicitly for browser clients.",
    realWorldExample: "B2B API issues JWT after client credentials; gateway validates signature and forwards roles to microservices.",
    architectureDiagram: `Request → SecurityFilterChain → Authentication → Authorization → Controller`,
    flowDiagram: `Login → Authenticate → Issue JWT → Client sends Bearer → Validate → Access granted/denied`,
    syntax: `@Bean SecurityFilterChain filterChain(HttpSecurity http) throws Exception {\n  return http.csrf(csrf -> csrf.disable())\n    .authorizeHttpRequests(a -> a.requestMatchers("/health").permitAll().anyRequest().authenticated())\n    .oauth2ResourceServer(o -> o.jwt(Customizer.withDefaults()))\n    .build();\n}`,
    practicalExample: `@PreAuthorize("hasRole('ADMIN')")\n@DeleteMapping("/users/{id}")\npublic void delete(@PathVariable Long id) { ... }`,
    exercise: "Secure /api/admin/** for ROLE_ADMIN only; leave /health public.",
    assignment: "Document threat model: CSRF, XSS via tokens, and refresh token rotation plan.",
    miniProject: "Auth module: register/login, JWT filter, role-based product admin routes.",
    quiz: [
      { question: "BCrypt is used for:", options: ["Password hashing", "JSON parsing", "SQL joins", "CSS"], correct: 0 },
      { question: "JWT is typically:", options: ["Stateful server session", "Stateless signed token", "Database row", "HTML form"], correct: 1 }
    ],
    interview: ["Filter chain order?", "OAuth2 vs JWT?", "How to test secured endpoints?"]
  },
  {
    title: "Testing",
    overview: "Spring Boot testing slices isolate layers—@WebMvcTest for controllers, @DataJpaTest for persistence, @SpringBootTest for full integration.",
    theory: "MockMvc simulates HTTP without server. @MockBean replaces container beans. Testcontainers spin real PostgreSQL in CI. @Transactional tests roll back DB changes by default on slice tests.",
    explanation: "Prefer narrow slices for speed. Use WireMock for external HTTP. Assert JSON with jsonPath. Test security with @WithMockUser.",
    realWorldExample: "CI runs 200 @WebMvcTest controller tests in seconds; nightly Testcontainers integration verifies SQL migrations.",
    architectureDiagram: `@WebMvcTest → MockMvc → Controller + @MockBean Service\n@DataJpaTest → JPA + in-memory or Testcontainers DB`,
    flowDiagram: `Arrange mocks → Perform request → Assert status/body → Verify interactions`,
    syntax: `@WebMvcTest(UserController.class)\nclass UserControllerTest {\n  @Autowired MockMvc mvc;\n  @MockBean UserService service;\n}`,
    practicalExample: `mvc.perform(post("/api/users").contentType(APPLICATION_JSON).content(body))\n  .andExpect(status().isCreated())\n  .andExpect(jsonPath("$.email").value("a@b.com"));`,
    exercise: "Write MockMvc test for validation error 400 on empty email.",
    assignment: "Add Testcontainers integration test proving repository + migration works on PostgreSQL.",
    miniProject: "Test suite for bookstore API: controller slices + one full integration path.",
    quiz: [
      { question: "MockMvc tests:", options: ["Full browser E2E", "HTTP layer without server", "Only SQL", "Only CSS"], correct: 1 },
      { question: "@MockBean:", options: ["Replaces Spring bean in test context", "Deletes production bean", "Runs GC", "Parses JWT"], correct: 0 }
    ],
    interview: ["Slice vs full @SpringBootTest?", "How to test security?", "Testcontainers benefits?"]
  },
  {
    title: "Actuator",
    overview: "Spring Boot Actuator exposes health, metrics, and operational endpoints for Kubernetes probes and production monitoring.",
    theory: "management.endpoints.web.exposure.include controls published endpoints. /actuator/health reports UP/DOWN with probes liveness/readiness. Micrometer exports Prometheus metrics. Custom HealthIndicator beans extend checks.",
    explanation: "Never expose sensitive endpoints publicly. Secure actuator with separate port or Spring Security. Wire K8s probes to /actuator/health/liveness.",
    realWorldExample: "Grafana dashboards scrape actuator/prometheus; PagerDuty alerts on health DOWN after DB pool exhaustion.",
    architectureDiagram: `App → Actuator endpoints → Prometheus / K8s probes → Alerting`,
    flowDiagram: `Enable actuator → Configure exposure → Probe hits /health → Metrics scraped`,
    syntax: `management.endpoints.web.exposure.include=health,info,prometheus\nmanagement.endpoint.health.probes.enabled=true`,
    practicalExample: `@Component\npublic class DbHealth implements HealthIndicator {\n  public Health health() { return dataSource.isValid(2) ? Health.up().build() : Health.down().build(); }\n}`,
    exercise: "Add custom health indicator checking external API reachability.",
    assignment: "Write runbook mapping actuator endpoints to on-call diagnostics steps.",
    miniProject: "Docker Compose stack: app + Prometheus + Grafana dashboard for JVM metrics.",
    quiz: [
      { question: "Liveness probe checks:", options: ["App should restart if failing", "SQL syntax", "CSS load", "Git branch"], correct: 0 },
      { question: "Micrometer integrates with:", options: ["Prometheus", "Only log4j", "DNS", "FTP"], correct: 0 }
    ],
    interview: ["Health vs readiness?", "Securing actuator?", "Custom metrics example?"]
  },
  {
    title: "Configuration",
    overview: "Externalized configuration with profiles, environment variables, and @ConfigurationProperties keeps secrets out of code and supports dev/stage/prod parity.",
    theory: "application.yml hierarchy: default + application-prod.yml. @ConfigurationProperties binds typed records from prefix. Relaxed binding maps APP_DATASOURCE_URL to app.datasource.url. Spring Cloud Config optional for central stores.",
    explanation: "Secrets from env vars or vault—not git. Validate properties with @Validated and JSR-303 on property classes. Use @Profile(\"prod\") for prod-only beans.",
    realWorldExample: "Twelve-factor app: same JAR, different env vars for DB URL and API keys per environment.",
    architectureDiagram: `env vars / K8s secrets → Spring Environment → @ConfigurationProperties → Beans`,
    flowDiagram: `Load properties → Bind to record → Validate → Inject into services`,
    syntax: `@ConfigurationProperties(prefix = "app.payment")\npublic record PaymentProps(String apiUrl, Duration timeout) {}\n\n# application-prod.yml\napp:\n  payment:\n    api-url: https://pay.example.com`,
    practicalExample: `@EnableConfigurationProperties(PaymentProps.class)\n@Service\nclass PaymentClient {\n  PaymentClient(PaymentProps props) { this.baseUrl = props.apiUrl(); }\n}`,
    exercise: "Create dev and prod profiles with different logging levels and datasource URLs.",
    assignment: "Add configuration validation failing startup if required API key missing.",
    miniProject: "Multi-profile Boot app with @ConfigurationProperties for feature flags.",
    quiz: [
      { question: "@ConfigurationProperties binds:", options: ["Typed config from prefix", "HTTP routes", "SQL only", "Threads"], correct: 0 },
      { question: "Secrets should live in:", options: ["Git plain text", "Environment/vault", "CSS files", "JUnit tests"], correct: 1 }
    ],
    interview: ["Profiles vs property files?", "Relaxed binding example?", "12-factor config?"]
  }
];

for (const spec of SPRING_EXTENDED) {
  SPRING_BOOT_CURRICULUM.push(
    buildLesson({
      title: spec.title,
      description: spec.overview.slice(0, 120),
      difficulty: "Intermediate",
      duration: "28 min",
      codeLang: "java",
      overview: spec.overview,
      theory: spec.theory,
      explanation: spec.explanation,
      realWorldExample: spec.realWorldExample,
      architectureDiagram: spec.architectureDiagram,
      flowDiagram: spec.flowDiagram,
      syntax: spec.syntax,
      practicalExample: spec.practicalExample,
      bestPractices: [
        "Keep configuration externalized per environment",
        "Write slice tests for each layer",
        "Use constructor injection for required dependencies",
        "Monitor health and metrics in production"
      ],
      commonMistakes: [
        "Business logic in controllers",
        "Hard-coded secrets in source",
        "Missing transaction boundaries on writes",
        "Skipping integration tests for critical paths"
      ],
      exercise: spec.exercise,
      assignment: spec.assignment,
      miniProject: spec.miniProject,
      quizQuestions: spec.quiz,
      interviewQuestions: spec.interview,
      summary: `${spec.title} is essential for production Spring Boot services—practice with tests and realistic configuration.`,
      resources: ["Spring Boot reference", "Baeldung Spring guides", "spring.io/guides"]
    })
  );
}

export default SPRING_BOOT_CURRICULUM;
