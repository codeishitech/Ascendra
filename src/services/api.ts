import type {
  CareerDNA,
  CareerWorldData,
  RoadmapNode,
  RoadmapEdge,
  InventoryItem,
  BossBattle,
  AdaptiveChangeLog,
  User,
  AuthResponse,
  Mentor,
  MentorMessage,
  SkillItem,
  StudentProject,
} from '../types/career';
import { buildDomainRoadmap } from './domainRoadmaps';

const TOKEN_KEY = 'ascendra_auth_token';
const USER_KEY = 'ascendra_auth_user';
const LOCAL_DB_KEY = 'ascendra_local_db_v2';

// Track if running on a static host (e.g. GitHub Pages) where /api doesn't exist
let isStaticHost = false;

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (e) {
    return null;
  }
}

export function setStoredAuth(token: string, user: User) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {}
}

export function clearStoredAuth() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (e) {}
}

export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function getAuthHeaders(): HeadersInit {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// ==========================================
// SEED DATA FOR STANDALONE CLIENT EXECUTION
// ==========================================

const INITIAL_PROFILE: CareerDNA = {
  targetRole: 'AI Research Engineer',
  targetRoleDescription:
    'Designs, benchmarks, and implements deep learning architectures, transformer models, and scalable neural pipelines.',
  experienceLevel: 'intermediate',
  weeklyHours: 15,
  currentSkills: [
    {
      id: 's1',
      name: 'Python',
      category: 'Programming',
      verification: 'project_evidence',
      rating: 4,
      evidenceUrl: 'https://github.com/example/python-data-structures',
    },
    { id: 's2', name: 'Linear Algebra & Calculus', category: 'Mathematics', verification: 'assessed', rating: 3 },
    { id: 's3', name: 'NumPy & Pandas', category: 'Data Science', verification: 'project_evidence', rating: 4 },
    { id: 's4', name: 'PyTorch Basics', category: 'Deep Learning', verification: 'self_reported', rating: 2 },
  ],
  currentProjects: [
    {
      title: 'CIFAR-10 Residual ConvNet',
      description: 'Trained ResNet-18 variant achieving 91.4% test accuracy with data augmentations.',
      link: 'https://github.com/example/cifar-resnet',
    },
  ],
  xp: 1350,
  level: 4,
  title: 'Tensor Apprentice',
  competenciesVerifiedCount: 3,
};

const INITIAL_NODES: RoadmapNode[] = [
  {
    id: 'node-py-perf',
    title: 'Python High-Performance Profiling',
    subtitle: 'Vectorization, memory profiling & C-extensions',
    tier: 1,
    category: 'skill',
    prerequisites: [],
    estimatedHours: 8,
    status: 'completed',
    completedAt: '2026-09-15',
    position: { x: 80, y: 180 },
    evidenceSubmitted: {
      url: 'https://github.com/example/python-perf-benchmarks',
      note: 'Profiled memory allocations and optimized vector SIMD operations using Cython and cProfile.',
      submittedAt: '2026-09-15',
    },
    quest: {
      objective: 'Optimize data preprocessing bottleneck from 14s to <1.2s.',
      brief: 'Profile an unoptimized data ingestion pipeline using cProfile and memory_profiler, then vectorize with NumPy strided tricks.',
      steps: [
        'Run baseline memory and CPU profiling on synthetic 10M record dataset.',
        'Eliminate nested Python loops in favor of vectorized NumPy array operations.',
        'Benchmark speedup and write regression test suite.',
      ],
      tangibleDeliverable: 'GitHub repository with benchmark report and profiling flamegraph.',
      deliverableType: 'benchmark_report',
      rubric: [
        { id: 'r1', name: 'Optimization Magnitude', weight: 40, description: 'Demonstrated >5x speedup with repeatable benchmark.', maxScore: 100 },
        { id: 'r2', name: 'Memory Footprint', weight: 30, description: 'Zero memory leaks and low peak RAM consumption.', maxScore: 100 },
        { id: 'r3', name: 'Benchmarking Rigor', weight: 30, description: 'Statistically significant runs with variance measurement.', maxScore: 100 },
      ],
      curatedResources: [
        { title: 'Python High Performance (Jake VanderPlas)', url: 'https://jakevdp.github.io/PythonDataScienceHandbook/', type: 'guide' },
        { title: 'Scalene: High-performance CPU/GPU/memory profiler', url: 'https://github.com/plasma-umass/scalene', type: 'documentation' },
      ],
      interviewQuestions: [
        'How does Python GIL impact multi-threaded CPU bound tasks vs IO bound tasks?',
        'Explain how NumPy strided memory layouts avoid copying data during slicing.',
      ],
      xpReward: 350,
      estimatedHours: 8,
    },
  },
  {
    id: 'node-linalg-tensors',
    title: 'Tensor Calculus & Autodiff Engine',
    subtitle: 'Backprop from scratch & computational graphs',
    tier: 1,
    category: 'project',
    prerequisites: [],
    estimatedHours: 12,
    status: 'completed',
    completedAt: '2026-09-28',
    position: { x: 80, y: 360 },
    evidenceSubmitted: {
      url: 'https://github.com/example/micrograd-extended',
      note: 'Built mini reverse-mode autodiff engine with topological DAG sorting and broadcast operators.',
      submittedAt: '2026-09-28',
    },
    quest: {
      objective: 'Build an educational reverse-mode automatic differentiation engine in pure Python.',
      brief: 'Construct a DAG-based computation graph supporting scalar and matrix backpropagation, verifying analytical gradients against numerical finite differences.',
      steps: [
        'Implement Value class with forward and backward gradient lambdas.',
        'Implement topological sort to evaluate chain rule in reverse topological order.',
        'Validate backpropagation on a multi-layer perceptron fitting non-linear two-moons dataset.',
      ],
      tangibleDeliverable: 'Repository with unit-tested autograd engine and gradient check assertions.',
      deliverableType: 'github_repo',
      rubric: [
        { id: 'r1', name: 'Gradient Precision', weight: 40, description: 'Numerical vs analytical gradient error < 1e-5.', maxScore: 100 },
        { id: 'r2', name: 'DAG Topological Sorting', weight: 30, description: 'Proper backprop handling without node recalculation.', maxScore: 100 },
        { id: 'r3', name: 'Test Coverage', weight: 30, description: 'High test coverage including edge cases (e.g. self-addition x + x).', maxScore: 100 },
      ],
      curatedResources: [
        { title: 'Calculus on Computational Graphs (Chris Olah)', url: 'https://colah.github.io/posts/2015-08-Backprop/', type: 'guide' },
        { title: 'Micrograd Reference Implementation (Karpathy)', url: 'https://github.com/karpathy/micrograd', type: 'documentation' },
      ],
      interviewQuestions: [
        'Why is reverse-mode automatic differentiation preferred over forward-mode for neural network training?',
        'What numerical instability issues arise with float16 precision gradients during backprop?',
      ],
      xpReward: 500,
      estimatedHours: 12,
    },
  },
  {
    id: 'node-pytorch-custom',
    title: 'Custom PyTorch CUDA & Autograd Ops',
    subtitle: 'Custom loss functions, hooks & memory management',
    tier: 2,
    category: 'skill',
    prerequisites: ['node-py-perf', 'node-linalg-tensors'],
    estimatedHours: 14,
    status: 'available',
    position: { x: 380, y: 220 },
    quest: {
      objective: 'Implement custom Focal Loss and backward pass hook with PyTorch C++/CUDA extension.',
      brief: 'Write a numerically stable custom loss function addressing class imbalance, complete with torch.autograd.Function and memory pinning benchmark.',
      steps: [
        'Implement vectorized log-sum-exp numerical stabilization.',
        'Wrap in torch.autograd.Function with custom forward and backward passes.',
        'Profile GPU VRAM consumption using torch.cuda.memory_allocated and benchmark training throughput.',
      ],
      tangibleDeliverable: 'PyTorch module packaged with pytest test suite and CUDA allocation profile.',
      deliverableType: 'github_repo',
      rubric: [
        { id: 'r1', name: 'Numerical Stability', weight: 35, description: 'No NaN or underflow even with extreme class logits.', maxScore: 100 },
        { id: 'r2', name: 'Backward Pass Verification', weight: 35, description: 'Passes torch.autograd.gradcheck with eps=1e-6.', maxScore: 100 },
        { id: 'r3', name: 'Throughput', weight: 30, description: 'Equal to or faster than native standard PyTorch modules.', maxScore: 100 },
      ],
      curatedResources: [
        { title: 'Extending PyTorch Documentation', url: 'https://pytorch.org/docs/stable/notes/extending.html', type: 'documentation' },
        { title: 'Focal Loss for Dense Object Detection (Lin et al.)', url: 'https://arxiv.org/abs/1708.02002', type: 'paper' },
      ],
      interviewQuestions: [
        'When should you implement torch.autograd.Function vs a standard nn.Module?',
        'How does torch.cuda.amp (Automatic Mixed Precision) interact with gradient scaling?',
      ],
      xpReward: 600,
      estimatedHours: 14,
    },
  },
  {
    id: 'node-transformer-arch',
    title: 'Self-Attention & Transformer Architecture',
    subtitle: 'Multi-head attention, RoPE & causal masking',
    tier: 2,
    category: 'skill',
    prerequisites: ['node-linalg-tensors'],
    estimatedHours: 16,
    status: 'available',
    position: { x: 380, y: 400 },
    quest: {
      objective: 'Implement a decoder-only causal Transformer (GPT-style) from mathematical first principles.',
      brief: 'Build Multi-Head Attention, RoPE (Rotary Position Embeddings), KV-caching, and RMSNorm from scratch without using nn.Transformer.',
      steps: [
        'Write scaled dot-product attention with causal triangular masking.',
        'Implement rotary positional embedding (RoPE) tensor operations.',
        'Implement inference-time Key-Value (KV) cache for fast autoregressive decoding.',
        'Train on TinyShakespeare or Mini-Wiki dataset to demonstrate loss convergence.',
      ],
      tangibleDeliverable: 'Modular transformer codebase with generation script and training loss curve.',
      deliverableType: 'github_repo',
      rubric: [
        { id: 'r1', name: 'Mathematical Correctness', weight: 40, description: 'Exact scaling, masking, and projection alignment.', maxScore: 100 },
        { id: 'r2', name: 'KV-Cache Speedup', weight: 30, description: 'O(N) generation latency per token instead of O(N^2).', maxScore: 100 },
        { id: 'r3', name: 'Loss Convergence', weight: 30, description: 'Demonstrated reduction in cross-entropy loss on test set.', maxScore: 100 },
      ],
      curatedResources: [
        { title: 'Attention Is All You Need (Vaswani et al.)', url: 'https://arxiv.org/abs/1706.03762', type: 'paper' },
        { title: 'The Illustrated Transformer (Jay Alammar)', url: 'https://jalammar.github.io/illustrated-transformer/', type: 'guide' },
      ],
      interviewQuestions: [
        'Why do we divide dot-product attention by sqrt(d_k)?',
        'Explain how FlashAttention avoids materializing the full N x N attention matrix in HBM.',
      ],
      xpReward: 750,
      estimatedHours: 16,
    },
  },
  {
    id: 'node-eval-benchmarks',
    title: 'LLM Evaluation & Scientific Benchmarking',
    subtitle: 'MMLU, HumanEval, perplexity & calibration testing',
    tier: 3,
    category: 'assessment',
    prerequisites: ['node-transformer-arch'],
    estimatedHours: 10,
    status: 'locked',
    position: { x: 680, y: 380 },
    quest: {
      objective: 'Build an automated evaluation harness with confidence calibration and robustness checks.',
      brief: 'Create an evaluation harness that tests an open-weights model against code generation or math reasoning benchmarks, measuring pass@k, exact match, and expected calibration error (ECE).',
      steps: [
        'Implement pass@1 and pass@10 unbiased estimators.',
        'Compute calibration curve and Brier score over model prediction confidence.',
        'Automate report generation displaying failure modes and prompt sensitivity.',
      ],
      tangibleDeliverable: 'Benchmark harness repository with automated evaluation dashboard output.',
      deliverableType: 'benchmark_report',
      rubric: [
        { id: 'r1', name: 'Statistical Rigor', weight: 35, description: 'Unbiased metric estimators with bootstrap confidence intervals.', maxScore: 100 },
        { id: 'r2', name: 'Failure Mode Categorization', weight: 35, description: 'Systematic diagnosis of hallucinations and syntax errors.', maxScore: 100 },
        { id: 'r3', name: 'Reproducibility', weight: 30, description: 'Deterministic seeding and clear environment specifications.', maxScore: 100 },
      ],
      curatedResources: [
        { title: 'Evaluating Large Language Models Trained on Code (Chen et al.)', url: 'https://arxiv.org/abs/2107.03374', type: 'paper' },
        { title: 'EleutherAI LM Evaluation Harness', url: 'https://github.com/EleutherAI/lm-evaluation-harness', type: 'documentation' },
      ],
      interviewQuestions: [
        'What are the limitations of perplexity as a proxy for downstream task quality?',
        'How do you prevent data contamination between training corpora and evaluation benchmarks?',
      ],
      xpReward: 650,
      estimatedHours: 10,
    },
  },
  {
    id: 'node-distributed-training',
    title: 'Distributed Training & Pipeline Parallelism',
    subtitle: 'DDP, FSDP, ZeRO stages & gradient accumulation',
    tier: 3,
    category: 'skill',
    prerequisites: ['node-pytorch-custom', 'node-transformer-arch'],
    estimatedHours: 18,
    status: 'locked',
    position: { x: 680, y: 180 },
    quest: {
      objective: 'Configure and train a multi-GPU distributed model using PyTorch FSDP (Fully Sharded Data Parallel).',
      brief: 'Scale model training across simulated or real multiple GPU devices. Implement ZeRO-3 parameter sharding, gradient accumulation, and evaluate communication vs compute overhead.',
      steps: [
        'Write multi-process distributed launcher with torchrun.',
        'Configure FSDP auto-wrap policy for transformer layers.',
        'Measure compute-to-communication ratio and analyze network bottleneck under varying batch sizes.',
      ],
      tangibleDeliverable: 'Distributed training script with performance log and throughput scaling chart.',
      deliverableType: 'github_repo',
      rubric: [
        { id: 'r1', name: 'Scaling Efficiency', weight: 40, description: 'Demonstrated >85% linear scaling throughput across devices.', maxScore: 100 },
        { id: 'r2', name: 'Memory Optimization', weight: 30, description: 'Effective activation checkpointing and ZeRO sharding.', maxScore: 100 },
        { id: 'r3', name: 'Fault Tolerance', weight: 30, description: 'Checkpoint save/resume without loss spikes.', maxScore: 100 },
      ],
      curatedResources: [
        { title: 'PyTorch FSDP Tutorial', url: 'https://pytorch.org/tutorials/intermediate/FSDP_tutorial.html', type: 'documentation' },
        { title: 'ZeRO: Memory Optimizations Toward Training Trillion Parameter Models', url: 'https://arxiv.org/abs/1910.02054', type: 'paper' },
      ],
      interviewQuestions: [
        'What is the difference between PyTorch DDP and FSDP in terms of memory sharding?',
        'How does all-reduce communication complexity scale with the number of worker nodes?',
      ],
      xpReward: 850,
      estimatedHours: 18,
    },
  },
  {
    id: 'node-boss-battle-ai',
    title: 'BOSS BATTLE: Titan Neural Core',
    subtitle: 'Train, Quantize & Serve High-Throughput Reasoning System',
    tier: 4,
    category: 'boss_battle',
    prerequisites: ['node-distributed-training', 'node-eval-benchmarks'],
    estimatedHours: 25,
    status: 'locked',
    position: { x: 960, y: 280 },
    quest: {
      objective: 'Grand Capstone Challenge: Build, fine-tune, evaluate, and deploy an end-to-end specialized reasoning agent pipeline.',
      brief: 'Combine all competencies into one production-grade portfolio masterpiece. Fine-tune a lightweight model with LoRA/DoRA, evaluate with scientific rigor, quantize to AWQ/GGUF, and serve with streaming vLLM endpoint achieving <20ms time-to-first-token.',
      steps: [
        'Phase 1: Dataset synthesis, curation, and quality filtering with rejection sampling.',
        'Phase 2: Supervised fine-tuning with LoRA using PyTorch/PEFT with mixed precision.',
        'Phase 3: Formal evaluation against baseline benchmarks with statistical significance tests.',
        'Phase 4: INT4/INT8 quantization and deployment with benchmarked p99 latency SLA.',
      ],
      tangibleDeliverable: 'Full production GitHub repository, live API deployment, and comprehensive technical research paper summary.',
      deliverableType: 'live_demo',
      rubric: [
        { id: 'r1', name: 'Model Quality Lift', weight: 30, description: 'Measurable statistically verified improvement on specialized benchmark.', maxScore: 100 },
        { id: 'r2', name: 'Inference Throughput & Latency', weight: 30, description: 'p99 latency < 25ms TTFT, memory-efficient serving.', maxScore: 100 },
        { id: 'r3', name: 'Portfolio Presentation', weight: 20, description: 'Exceptional documentation, architectural diagrams, and reproducibility.', maxScore: 100 },
        { id: 'r4', name: 'Rigorous Error Analysis', weight: 20, description: 'Detailed ablation study on what worked and what failed.', maxScore: 100 },
      ],
      curatedResources: [
        { title: 'LoRA: Low-Rank Adaptation of Large Language Models (Hu et al.)', url: 'https://arxiv.org/abs/2106.09685', type: 'paper' },
        { title: 'vLLM: Easy, Fast, and Cheap LLM Serving', url: 'https://docs.vllm.ai/', type: 'documentation' },
      ],
      interviewQuestions: [
        'Walk through your design choices for rank dimension r and alpha in LoRA.',
        'How do continuous batching and PagedAttention in vLLM prevent GPU memory fragmentation?',
      ],
      xpReward: 2000,
      estimatedHours: 25,
    },
  },
];

const INITIAL_EDGES: RoadmapEdge[] = [
  { id: 'e1', source: 'node-py-perf', target: 'node-pytorch-custom', animated: true },
  { id: 'e2', source: 'node-linalg-tensors', target: 'node-pytorch-custom', animated: true },
  { id: 'e3', source: 'node-linalg-tensors', target: 'node-transformer-arch', animated: true },
  { id: 'e4', source: 'node-pytorch-custom', target: 'node-distributed-training', animated: true },
  { id: 'e5', source: 'node-transformer-arch', target: 'node-distributed-training', animated: true },
  { id: 'e6', source: 'node-transformer-arch', target: 'node-eval-benchmarks', animated: true },
  { id: 'e7', source: 'node-distributed-training', target: 'node-boss-battle-ai', animated: true },
  { id: 'e8', source: 'node-eval-benchmarks', target: 'node-boss-battle-ai', animated: true },
];

const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-1',
    nodeId: 'node-py-perf',
    title: 'Python High-Performance Profiling Report',
    category: 'Optimization Benchmark',
    verification: 'project_evidence',
    deliverableType: 'benchmark_report',
    artifactUrl: 'https://github.com/example/python-perf-benchmarks',
    notes: 'Achieved 8.2x speedup using Cython bindings and memory caching. Verified by peer benchmark.',
    dateAdded: '2026-09-15',
    xpEarned: 350,
  },
  {
    id: 'inv-2',
    nodeId: 'node-linalg-tensors',
    title: 'Reverse-Mode Autodiff Engine (Micrograd-Extended)',
    category: 'Core System',
    verification: 'project_evidence',
    deliverableType: 'github_repo',
    artifactUrl: 'https://github.com/example/micrograd-extended',
    notes: 'Unit tested backpropagation engine passing gradient checking with epsilon 1e-6.',
    dateAdded: '2026-09-28',
    xpEarned: 500,
  },
  {
    id: 'inv-3',
    title: 'Linear Algebra & Calculus Diagnostic Assessment',
    category: 'Assessment',
    verification: 'assessed',
    deliverableType: 'code_review',
    artifactUrl: 'https://example.com/assessments/math-diagnostic-892',
    notes: 'Scored 88% on vector spaces, eigenvalues, and multivariate Jacobian matrices.',
    dateAdded: '2026-09-10',
    xpEarned: 500,
  },
];

const INITIAL_BOSS_BATTLES: BossBattle[] = [
  {
    id: 'boss-neural-core',
    title: 'Titan Neural Core: The Autonomous Model Nexus',
    codename: 'OP: SYNAPSE-TITAN',
    description:
      'A multi-phase trial synthesizing data curation, distributed LoRA fine-tuning, automated evaluation rigor, and low-latency quantization serving.',
    hpTotal: 4000,
    hpCurrent: 4000,
    requiredSkills: [
      'PyTorch CUDA Extensions',
      'Transformer Architecture',
      'FSDP Distributed Training',
      'LLM Scientific Benchmarking',
    ],
    phases: [
      { id: 'p1', title: 'Data Synthesis & Rejection Sampling', deliverable: 'Clean synthetic reasoning corpus with quality filtering', completed: false, xp: 500 },
      { id: 'p2', title: 'Distributed LoRA / DoRA Training', deliverable: 'Training runs with loss convergence curves', completed: false, xp: 500 },
      { id: 'p3', title: 'Adversarial Benchmarking Suite', deliverable: 'Statistical pass@k evaluation dashboard', completed: false, xp: 500 },
      { id: 'p4', title: 'High-Throughput vLLM Quantized Deployment', deliverable: 'Production API endpoint with <25ms TTFT', completed: false, xp: 500 },
    ],
    status: 'locked',
    lootSummary: 'Verified AI Research Engineer Passport Badge, Titan Architecture Blueprint Artifact, +2000 Career XP',
    xpReward: 2000,
  },
];

const SEED_MENTORS: Mentor[] = [
  {
    id: 'mentor-elena',
    name: 'Dr. Elena Vance',
    title: 'Staff AI Research Scientist',
    company: 'Google DeepMind',
    roleSpecialty: 'AI Research & Foundation Models',
    bio: 'Leads reasoning architecture research. Focuses on transformer mechanics, KV-cache latency optimizations, and scientific evaluation benchmarks.',
    experienceYears: 9,
    avatarUrl: 'EV',
    rating: 4.96,
    reviewCount: 42,
    availability: 'Accepting Mentees',
    skills: ['PyTorch', 'Transformer Theory', 'Distributed Training', 'vLLM', 'Scientific Benchmarks'],
    verifiedCompany: true,
  },
  {
    id: 'mentor-marcus',
    name: 'Marcus Chen',
    title: 'Principal Distributed Systems Architect',
    company: 'Netflix Systems',
    roleSpecialty: 'Distributed Systems & Cloud',
    bio: 'Designs multi-region event streaming meshes, consensus engines (Raft), and low-latency distributed storage systems serving 250M+ users.',
    experienceYears: 12,
    avatarUrl: 'MC',
    rating: 4.94,
    reviewCount: 56,
    availability: 'Limited Slots',
    skills: ['Go', 'Raft Consensus', 'Kafka', 'Distributed KV', 'Fault Tolerance'],
    verifiedCompany: true,
  },
  {
    id: 'mentor-priya',
    name: 'Priya Sharma',
    title: 'Staff Infrastructure & MLOps Lead',
    company: 'Stripe',
    roleSpecialty: 'Cloud Infrastructure & MLOps',
    bio: 'Specializes in Kubernetes cluster scheduling, multi-cloud Terraform pipelines, and high-throughput model inference serving at financial scale.',
    experienceYears: 8,
    avatarUrl: 'PS',
    rating: 4.98,
    reviewCount: 38,
    availability: 'Accepting Mentees',
    skills: ['Kubernetes', 'Terraform', 'GPU Scheduling', 'Observability', 'GitOps'],
    verifiedCompany: true,
  },
  {
    id: 'mentor-alex',
    name: 'Alexander Ruiz',
    title: 'Robotics Autonomy Systems Lead',
    company: 'Boston Dynamics',
    roleSpecialty: 'Autonomous Systems & Robotics',
    bio: 'Architect of real-time control loops, sensor fusion algorithms (EKF), and hardware-accelerated SLAM systems for legged robotics.',
    experienceYears: 10,
    avatarUrl: 'AR',
    rating: 4.91,
    reviewCount: 29,
    availability: 'Accepting Mentees',
    skills: ['ROS2', 'C++20', 'Sensor Fusion', 'LiDAR SLAM', 'Real-Time Control'],
    verifiedCompany: true,
  },
  {
    id: 'mentor-sarah',
    name: 'Sarah Jenkins',
    title: 'Staff Kernel Security Specialist',
    company: 'Trail of Bits',
    roleSpecialty: 'Cyber Threat Defense & Systems',
    bio: 'Binary exploitation researcher, Linux eBPF telemetry developer, and memory-safe systems engineer. Guides students through secure systems rigor.',
    experienceYears: 11,
    avatarUrl: 'SJ',
    rating: 4.97,
    reviewCount: 47,
    availability: 'Limited Slots',
    skills: ['eBPF', 'Rust', 'Linux Kernel', 'Memory Safety', 'Threat Modeling'],
    verifiedCompany: true,
  },
  {
    id: 'mentor-david',
    name: 'David K. O\'Connor',
    title: 'Principal Web Platform Architect',
    company: 'Figma',
    roleSpecialty: 'Full-Stack Architecture & WebAssembly',
    bio: 'Specializes in high-performance collaborative real-time canvases, WebAssembly graphic runtimes, and distributed state CRDTs.',
    experienceYears: 9,
    avatarUrl: 'DO',
    rating: 4.93,
    reviewCount: 34,
    availability: 'Accepting Mentees',
    skills: ['TypeScript', 'WebAssembly', 'CRDTs', 'WebGL Canvas', 'System Design'],
    verifiedCompany: true,
  },
];

const INITIAL_MESSAGES: MentorMessage[] = [
  {
    id: 'msg-seed-1',
    senderId: 'mentor-elena',
    recipientId: 'guest',
    mentorId: 'mentor-elena',
    senderRole: 'mentor',
    text: 'Welcome to Ascendra! I reviewed your starting profile for the AI Research Engineer path. The reverse-mode autodiff project is an excellent foundation. When you start the custom PyTorch CUDA ops quest, make sure you pay close attention to memory pinning and gradcheck numerical stability.',
    timestamp: '2026-10-08T10:15:00Z',
  },
];

const DEMO_USER: User = {
  id: 'usr_demo_alex',
  email: 'alex@ascendra.dev',
  name: 'Alex Vance',
  targetRole: 'AI Research Engineer',
  createdAt: '2026-10-01T00:00:00.000Z',
};

interface LocalUserState {
  profile: CareerDNA;
  roadmap: CareerWorldData;
  inventory: InventoryItem[];
  bossBattles: BossBattle[];
  connectedMentors: string[];
}

interface LocalDatabase {
  users: (User & { passwordHash?: string })[];
  userStates: Record<string, LocalUserState>;
  defaultState: LocalUserState;
  mentors: Mentor[];
  messages: MentorMessage[];
}

function createDefaultState(): LocalUserState {
  return {
    profile: JSON.parse(JSON.stringify(INITIAL_PROFILE)),
    roadmap: {
      targetRole: INITIAL_PROFILE.targetRole,
      nodes: JSON.parse(JSON.stringify(INITIAL_NODES)),
      edges: JSON.parse(JSON.stringify(INITIAL_EDGES)),
    },
    inventory: JSON.parse(JSON.stringify(INITIAL_INVENTORY)),
    bossBattles: JSON.parse(JSON.stringify(INITIAL_BOSS_BATTLES)),
    connectedMentors: ['mentor-elena'],
  };
}

function createNewUserState(targetRole: string = 'AI Research Engineer'): LocalUserState {
  const freshNodes: RoadmapNode[] = INITIAL_NODES.map((n) => ({
    ...n,
    status: (n.prerequisites.length === 0 ? 'available' : 'locked') as any,
    completedAt: undefined,
    evidenceSubmitted: undefined,
  }));

  const { updatedNodes } = updateDeterministicProgression(freshNodes);

  return {
    profile: {
      ...INITIAL_PROFILE,
      targetRole,
      title: 'Tier I Initiate',
      xp: 0,
      level: 1,
      competenciesVerifiedCount: 0,
      currentSkills: [
        { id: `s-${Date.now()}-1`, name: 'Python', category: 'Core Tech', verification: 'self_reported', rating: 3 },
        { id: `s-${Date.now()}-2`, name: 'Git & Version Control', category: 'Tooling', verification: 'project_evidence', rating: 4 },
      ],
      currentProjects: [],
    },
    roadmap: {
      targetRole,
      nodes: updatedNodes,
      edges: JSON.parse(JSON.stringify(INITIAL_EDGES)),
      lastAdaptiveChange: {
        reason: `New career journey initialized for "${targetRole}". Begin your progression with any available Tier 1 quest!`,
        timestamp: new Date().toISOString(),
        affectedNodes: updatedNodes.filter((n) => n.status === 'available').map((n) => n.id),
        unlockedCount: updatedNodes.filter((n) => n.status === 'available').length,
      },
    },
    inventory: [],
    bossBattles: JSON.parse(JSON.stringify(INITIAL_BOSS_BATTLES)).map((b: BossBattle) => ({
      ...b,
      status: 'locked',
      hpCurrent: b.hpTotal,
      phases: b.phases.map((p) => ({ ...p, completed: false })),
    })),
    connectedMentors: ['mentor-elena'],
  };
}

function loadLocalDb(): LocalDatabase {
  try {
    const raw = localStorage.getItem(LOCAL_DB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.defaultState && parsed.userStates) {
        return parsed;
      }
    }
  } catch (e) {}

  const defaultState = createDefaultState();
  const db: LocalDatabase = {
    users: [{ ...DEMO_USER, passwordHash: 'demo1234' }],
    userStates: {
      [DEMO_USER.id]: defaultState,
    },
    defaultState,
    mentors: SEED_MENTORS,
    messages: INITIAL_MESSAGES,
  };
  saveLocalDb(db);
  return db;
}

function saveLocalDb(db: LocalDatabase) {
  try {
    localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(db));
  } catch (e) {}
}

function resolveActiveLocalState(db: LocalDatabase): { user: User | null; state: LocalUserState; userId: string } {
  const token = getStoredToken();
  if (token) {
    const user = db.users.find((u) => u.id === token || `token_${u.id}` === token);
    if (user && db.userStates[user.id]) {
      return { user, state: db.userStates[user.id], userId: user.id };
    }
  }
  return { user: null, state: db.defaultState, userId: 'guest' };
}

function updateDeterministicProgression(nodes: RoadmapNode[]): { updatedNodes: RoadmapNode[]; newlyUnlockedIds: string[] } {
  const completedIds = new Set(
    nodes.filter((n) => n.status === 'completed').map((n) => n.id)
  );

  const newlyUnlockedIds: string[] = [];

  const updatedNodes = nodes.map((node) => {
    if (node.status === 'completed') {
      return node;
    }

    const allPrereqsMet = node.prerequisites.every((prereqId) => completedIds.has(prereqId));

    if (allPrereqsMet) {
      if (node.status === 'locked') {
        newlyUnlockedIds.push(node.id);
      }
      return {
        ...node,
        status: node.status === 'active' ? ('active' as const) : ('available' as const),
      };
    } else {
      return {
        ...node,
        status: 'locked' as const,
      };
    }
  });

  return { updatedNodes, newlyUnlockedIds };
}

// Resilient fetch: attempts backend, falls back cleanly on 404 / HTML response (GitHub Pages)
async function requestWithFallback<T>(url: string, options?: RequestInit): Promise<T | null> {
  if (isStaticHost) {
    return null;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const contentType = res.headers.get('content-type') || '';
    if (!res.ok || !contentType.includes('application/json')) {
      if (res.status === 404 || contentType.includes('text/html')) {
        isStaticHost = true;
      }
      return null;
    }

    return (await res.json()) as T;
  } catch (err) {
    // Network error or timeout (static hosting or offline)
    isStaticHost = true;
    return null;
  }
}

// ==========================================
// UNIFIED HYBRID API EXPORT
// ==========================================

export const api = {
  // Authentication
  async signup(data: { email: string; password: string; name: string; targetRole?: string }): Promise<AuthResponse> {
    const serverResult = await requestWithFallback<AuthResponse>('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (serverResult) {
      setStoredAuth(serverResult.token, serverResult.user);
      return serverResult;
    }

    // Client-side fallback
    const db = loadLocalDb();
    const existing = db.users.find((u) => u.email.toLowerCase() === data.email.toLowerCase().trim());
    if (existing) {
      throw new Error('An account with this email already exists');
    }

    const userId = `usr_${Date.now()}`;
    const newUser: User & { passwordHash?: string } = {
      id: userId,
      email: data.email.toLowerCase().trim(),
      name: data.name.trim(),
      targetRole: data.targetRole || 'AI Research Engineer',
      createdAt: new Date().toISOString(),
      passwordHash: data.password,
    };
    db.users.push(newUser);

    const userState = createNewUserState(newUser.targetRole);
    db.userStates[userId] = userState;
    saveLocalDb(db);

    const authRes: AuthResponse = {
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        targetRole: newUser.targetRole,
        createdAt: newUser.createdAt,
      },
      token: newUser.id,
      profile: userState.profile,
      roadmap: userState.roadmap,
    };
    setStoredAuth(authRes.token, authRes.user);
    return authRes;
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const serverResult = await requestWithFallback<AuthResponse>('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (serverResult) {
      setStoredAuth(serverResult.token, serverResult.user);
      return serverResult;
    }

    // Client-side fallback
    const db = loadLocalDb();
    const user = db.users.find(
      (u) =>
        u.email.toLowerCase() === data.email.toLowerCase().trim() &&
        (u.passwordHash === data.password || data.email === 'alex@ascendra.dev')
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const userState = db.userStates[user.id] || db.defaultState;
    const authRes: AuthResponse = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        targetRole: user.targetRole,
        createdAt: user.createdAt,
      },
      token: user.id,
      profile: userState.profile,
      roadmap: userState.roadmap,
    };
    setStoredAuth(authRes.token, authRes.user);
    return authRes;
  },

  async getMe(): Promise<{ user: User | null; profile: CareerDNA; roadmap: CareerWorldData }> {
    const serverResult = await requestWithFallback<{ user: User | null; profile: CareerDNA; roadmap: CareerWorldData }>(
      '/api/auth/me',
      { headers: getAuthHeaders() }
    );

    if (serverResult) return serverResult;

    // Client-side fallback
    const db = loadLocalDb();
    const { user, state } = resolveActiveLocalState(db);
    return {
      user,
      profile: state.profile,
      roadmap: state.roadmap,
    };
  },

  async logout(): Promise<void> {
    await requestWithFallback('/api/auth/logout', { method: 'POST', headers: getAuthHeaders() });
    clearStoredAuth();
  },

  // Career DNA & Profile
  async getProfile(): Promise<CareerDNA> {
    const serverResult = await requestWithFallback<CareerDNA>('/api/profile', {
      headers: getAuthHeaders(),
    });
    if (serverResult) return serverResult;

    const db = loadLocalDb();
    const { state } = resolveActiveLocalState(db);
    return state.profile;
  },

  async updateProfile(profile: Partial<CareerDNA>): Promise<CareerDNA> {
    const serverResult = await requestWithFallback<CareerDNA>('/api/profile', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(profile),
    });
    if (serverResult) return serverResult;

    const db = loadLocalDb();
    const { state } = resolveActiveLocalState(db);
    state.profile = { ...state.profile, ...profile };
    saveLocalDb(db);
    return state.profile;
  },

  // Roadmap
  async getRoadmap(): Promise<CareerWorldData> {
    const serverResult = await requestWithFallback<CareerWorldData>('/api/roadmap', {
      headers: getAuthHeaders(),
    });
    if (serverResult) return serverResult;

    const db = loadLocalDb();
    const { state } = resolveActiveLocalState(db);
    const { updatedNodes } = updateDeterministicProgression(state.roadmap.nodes);
    state.roadmap.nodes = updatedNodes;
    saveLocalDb(db);
    return state.roadmap;
  },

  async generateRoadmap(params: {
    targetRole: string;
    weeklyHours: number;
    experienceLevel: string;
    currentSkills: SkillItem[];
    currentProjects: StudentProject[];
    specializationSubTrack?: string;
    timelineMonths?: number;
    learningStyle?: string;
    preferredDeliverable?: string;
    targetCompanyTier?: string;
    masteredTopicsToSkip?: string[];
    priorityWeaknesses?: string[];
  }): Promise<{ roadmap: CareerWorldData; profile: CareerDNA; bossBattles: BossBattle[] }> {
    const serverResult = await requestWithFallback<{
      roadmap: CareerWorldData;
      profile: CareerDNA;
      bossBattles: BossBattle[];
    }>('/api/roadmap/generate', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(params),
    });
    if (serverResult) return serverResult;

    // Full deterministic client-side generation engine via domainRoadmaps.ts
    const db = loadLocalDb();
    const { state } = resolveActiveLocalState(db);

    const generated = buildDomainRoadmap({
      targetRole: params.targetRole,
      specializationSubTrack: params.specializationSubTrack,
      weeklyHours: params.weeklyHours,
      experienceLevel: params.experienceLevel,
      currentSkills: params.currentSkills || [],
      currentProjects: params.currentProjects || [],
      timelineMonths: params.timelineMonths,
      learningStyle: params.learningStyle,
      preferredDeliverable: params.preferredDeliverable,
      targetCompanyTier: params.targetCompanyTier,
      masteredTopicsToSkip: params.masteredTopicsToSkip,
      priorityWeaknesses: params.priorityWeaknesses,
    });

    // Update profile
    state.profile.targetRole = params.targetRole;
    state.profile.targetRoleDescription = generated.roleDescription;
    state.profile.experienceLevel = params.experienceLevel as any;
    state.profile.weeklyHours = params.weeklyHours;
    state.profile.currentSkills = params.currentSkills || [];
    state.profile.currentProjects = params.currentProjects || [];
    state.profile.specializationSubTrack = params.specializationSubTrack;
    state.profile.timelineMonths = params.timelineMonths;

    const knownTokens = new Set<string>();
    (params.currentSkills || []).forEach((s) => {
      if (s.rating >= 3 || s.verification !== 'self_reported') {
        s.name.toLowerCase().split(/[\s,+/&]+/).forEach((t) => { if (t.length > 2) knownTokens.add(t); });
      }
    });
    (params.masteredTopicsToSkip || []).forEach((topic) => {
      topic.toLowerCase().split(/[\s,+/&]+/).forEach((t) => { if (t.length > 2) knownTokens.add(t); });
    });

    let nodes: RoadmapNode[] = generated.nodes.map((n, idx) => {
      const nodeText = `${n.title} ${n.subtitle}`.toLowerCase();
      const isKnown = n.tier === 1 && Array.from(knownTokens).some((t) => nodeText.includes(t));
      if (isKnown) {
        return {
          ...n,
          status: 'completed' as const,
          completedAt: new Date(Date.now() - 86400000 * (4 - idx)).toISOString().split('T')[0],
          evidenceSubmitted: {
            url: 'Verified baseline in Career DNA',
            note: `Skill validated via profile competency baseline. Prerequisite satisfied.`,
            submittedAt: new Date().toISOString(),
          },
        };
      }
      return {
        ...n,
        status: n.tier === 1 ? ('available' as const) : ('locked' as const),
      };
    });

    const { updatedNodes } = updateDeterministicProgression(nodes);

    state.roadmap = {
      targetRole: params.targetRole,
      nodes: updatedNodes,
      edges: generated.edges,
      lastAdaptiveChange: {
        reason: `Personalized Career World forged for "${params.targetRole}"${
          params.specializationSubTrack ? ` (${params.specializationSubTrack})` : ''
        } calibrated to ${params.weeklyHours}h/week dedication over ${params.timelineMonths || 6} months.`,
        timestamp: new Date().toISOString(),
        affectedNodes: updatedNodes.map((n) => n.id),
        unlockedCount: updatedNodes.filter((n) => n.status === 'available').length,
      },
    };

    state.bossBattles = [generated.bossBattle];
    saveLocalDb(db);

    return {
      roadmap: state.roadmap,
      profile: state.profile,
      bossBattles: state.bossBattles,
    };
  },

  async markNodeKnown(nodeId: string, reason?: string): Promise<{
    success: boolean;
    roadmap: CareerWorldData;
    profile: CareerDNA;
    adaptiveNotice: AdaptiveChangeLog;
  }> {
    const serverResult = await requestWithFallback<{
      success: boolean;
      roadmap: CareerWorldData;
      profile: CareerDNA;
      adaptiveNotice: AdaptiveChangeLog;
    }>('/api/roadmap/node/mark-known', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ nodeId, reason }),
    });
    if (serverResult) return serverResult;

    // Client-side fallback
    const db = loadLocalDb();
    const { state } = resolveActiveLocalState(db);

    const targetNode = state.roadmap.nodes.find((n) => n.id === nodeId);
    if (!targetNode) {
      throw new Error('Node not found');
    }

    targetNode.status = 'completed';
    targetNode.completedAt = new Date().toISOString();
    targetNode.evidenceSubmitted = {
      url: 'Self-Verified / Prior Experience',
      note: reason || 'Marked as already known through prior academic or professional experience.',
      submittedAt: new Date().toISOString(),
    };

    const { updatedNodes, newlyUnlockedIds } = updateDeterministicProgression(state.roadmap.nodes);
    state.roadmap.nodes = updatedNodes;

    const newInventoryItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      nodeId: targetNode.id,
      title: `${targetNode.title} (Fast-Tracked)`,
      category: targetNode.category,
      verification: 'self_reported',
      deliverableType: 'code_review',
      artifactUrl: 'Prior Knowledge / Verified Baseline',
      notes: `Skill fast-tracked by student: ${reason || 'Prior competence demonstrated.'}`,
      dateAdded: new Date().toISOString().split('T')[0],
      xpEarned: Math.round(targetNode.quest.xpReward * 0.5),
    };
    state.inventory.unshift(newInventoryItem);

    state.profile.xp += newInventoryItem.xpEarned;
    state.profile.level = Math.floor(state.profile.xp / 600) + 1;

    const tacticalExplanation = `Fast-tracked "${targetNode.title}". Career engine re-evaluated graph dependencies: unlocked ${
      newlyUnlockedIds.length
    } dependent quest${newlyUnlockedIds.length === 1 ? '' : 's'}. You are now primed to tackle tier ${
      targetNode.tier + 1
    } system deliverables!`;

    state.roadmap.lastAdaptiveChange = {
      reason: tacticalExplanation,
      timestamp: new Date().toISOString(),
      affectedNodes: newlyUnlockedIds,
      unlockedCount: newlyUnlockedIds.length,
    };

    saveLocalDb(db);

    return {
      success: true,
      roadmap: state.roadmap,
      profile: state.profile,
      adaptiveNotice: state.roadmap.lastAdaptiveChange,
    };
  },

  async completeQuest(
    nodeId: string,
    payload: {
      evidenceUrl: string;
      note: string;
      rubricScores?: Record<string, number>;
      verificationType?: 'self_reported' | 'assessed' | 'project_evidence';
    }
  ): Promise<{
    success: boolean;
    node: RoadmapNode;
    xpGained: number;
    leveledUp: boolean;
    newLevel: number;
    newlyUnlockedIds: string[];
    inventoryItem: InventoryItem;
    roadmap: CareerWorldData;
    profile: CareerDNA;
  }> {
    const serverResult = await requestWithFallback<{
      success: boolean;
      node: RoadmapNode;
      xpGained: number;
      leveledUp: boolean;
      newLevel: number;
      newlyUnlockedIds: string[];
      inventoryItem: InventoryItem;
      roadmap: CareerWorldData;
      profile: CareerDNA;
    }>(`/api/quest/${nodeId}/complete`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (serverResult) return serverResult;

    // Client-side fallback
    const db = loadLocalDb();
    const { state } = resolveActiveLocalState(db);

    const node = state.roadmap.nodes.find((n) => n.id === nodeId);
    if (!node) {
      throw new Error('Node not found');
    }

    node.status = 'completed';
    node.completedAt = new Date().toISOString();
    node.evidenceSubmitted = {
      url: payload.evidenceUrl || 'Verified in Quest Sandbox',
      note: payload.note || 'Successfully met all rubric deliverables.',
      rubricScores: payload.rubricScores || {},
      submittedAt: new Date().toISOString(),
    };

    const xpGained = node.quest.xpReward || 500;
    state.profile.xp += xpGained;
    const prevLevel = state.profile.level;
    state.profile.level = Math.floor(state.profile.xp / 600) + 1;
    const leveledUp = state.profile.level > prevLevel;

    const vType = payload.verificationType || 'project_evidence';
    if (vType === 'project_evidence' || vType === 'assessed') {
      state.profile.competenciesVerifiedCount += 1;
    }

    if (state.profile.level >= 8) {
      state.profile.title = 'Principal Forge Architect';
    } else if (state.profile.level >= 5) {
      state.profile.title = 'Senior Systems Artisan';
    } else if (state.profile.level >= 3) {
      state.profile.title = 'Tensor Journeyman';
    }

    const newInventoryItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      nodeId: node.id,
      title: node.title,
      category: node.category,
      verification: vType,
      deliverableType: node.quest.deliverableType,
      artifactUrl: payload.evidenceUrl || 'https://github.com/student/verified-deliverable',
      notes: payload.note || `Deliverable submitted for ${node.title}. Evaluated against rubric.`,
      dateAdded: new Date().toISOString().split('T')[0],
      xpEarned: xpGained,
    };
    state.inventory.unshift(newInventoryItem);

    const { updatedNodes, newlyUnlockedIds } = updateDeterministicProgression(state.roadmap.nodes);
    state.roadmap.nodes = updatedNodes;

    if (state.bossBattles.length > 0) {
      const boss = state.bossBattles[0];
      const bossNode = state.roadmap.nodes.find((n) => n.category === 'boss_battle');
      if (bossNode && (bossNode.status === 'available' || bossNode.status === 'active')) {
        boss.status = 'unlocked';
      }
    }

    saveLocalDb(db);

    return {
      success: true,
      node,
      xpGained,
      leveledUp,
      newLevel: state.profile.level,
      newlyUnlockedIds,
      inventoryItem: newInventoryItem,
      roadmap: state.roadmap,
      profile: state.profile,
    };
  },

  async getAIHint(nodeId: string, question?: string): Promise<{ advice: string }> {
    const serverResult = await requestWithFallback<{ advice: string }>(`/api/quest/${nodeId}/ai-hint`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ question }),
    });
    if (serverResult) return serverResult;

    const db = loadLocalDb();
    const { state } = resolveActiveLocalState(db);
    const node = state.roadmap.nodes.find((n) => n.id === nodeId);

    const advice = node
      ? `For "${node.title}": Focus on proving ${node.quest.rubric[0]?.name || 'numerical precision'} first. ${
          node.quest.steps[0] || 'Write unit tests before profiling.'
        } When preparing your ${node.quest.deliverableType.replace(/_/g, ' ')}, ensure deterministic reproduction steps so judges and mentors can verify your benchmarks instantly.`
      : 'Review the technical rubric carefully and verify boundary conditions with targeted assertions.';

    return { advice };
  },

  // Inventory
  async getInventory(): Promise<InventoryItem[]> {
    const serverResult = await requestWithFallback<InventoryItem[]>('/api/inventory', {
      headers: getAuthHeaders(),
    });
    if (serverResult) return serverResult;

    const db = loadLocalDb();
    const { state } = resolveActiveLocalState(db);
    return state.inventory;
  },

  async addInventoryItem(item: Partial<InventoryItem>): Promise<InventoryItem> {
    const serverResult = await requestWithFallback<InventoryItem>('/api/inventory', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(item),
    });
    if (serverResult) return serverResult;

    const db = loadLocalDb();
    const { state } = resolveActiveLocalState(db);
    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      title: item.title || 'Verified Artifact',
      category: item.category || 'Portfolio Evidence',
      verification: item.verification || 'project_evidence',
      deliverableType: item.deliverableType || 'github_repo',
      artifactUrl: item.artifactUrl || 'https://github.com/student/artifact',
      notes: item.notes || 'Added to Career Inventory.',
      dateAdded: new Date().toISOString().split('T')[0],
      xpEarned: item.xpEarned || 250,
    };
    state.inventory.unshift(newItem);
    state.profile.xp += newItem.xpEarned;
    saveLocalDb(db);
    return newItem;
  },

  // Boss Arena
  async getBossBattles(): Promise<BossBattle[]> {
    const serverResult = await requestWithFallback<BossBattle[]>('/api/boss-battles', {
      headers: getAuthHeaders(),
    });
    if (serverResult) return serverResult;

    const db = loadLocalDb();
    const { state } = resolveActiveLocalState(db);
    return state.bossBattles;
  },

  async strikeBoss(payload: {
    bossId: string;
    phaseId: string;
    evidenceUrl?: string;
    notes?: string;
  }): Promise<{ success: boolean; boss: BossBattle; profile: CareerDNA }> {
    const serverResult = await requestWithFallback<{ success: boolean; boss: BossBattle; profile: CareerDNA }>(
      '/api/boss-battles/strike',
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      }
    );
    if (serverResult) return serverResult;

    const db = loadLocalDb();
    const { state } = resolveActiveLocalState(db);
    const boss = state.bossBattles.find((b) => b.id === payload.bossId) || state.bossBattles[0];
    if (!boss) throw new Error('Boss not found');

    const phase = boss.phases.find((p) => p.id === payload.phaseId);
    if (!phase) throw new Error('Phase not found');

    if (!phase.completed) {
      phase.completed = true;
      const damage = Math.round(boss.hpTotal / boss.phases.length);
      boss.hpCurrent = Math.max(0, boss.hpCurrent - damage);

      state.profile.xp += phase.xp;
      state.profile.level = Math.floor(state.profile.xp / 600) + 1;

      state.inventory.unshift({
        id: `inv-boss-${Date.now()}`,
        title: `[Boss Trial] ${boss.title} — ${phase.title}`,
        category: 'Boss Battle Phase',
        verification: 'project_evidence',
        deliverableType: 'live_demo',
        artifactUrl: payload.evidenceUrl || 'https://github.com/student/boss-battle-artifact',
        notes: payload.notes || `Completed phase deliverable: ${phase.deliverable}`,
        dateAdded: new Date().toISOString().split('T')[0],
        xpEarned: phase.xp,
      });

      if (boss.hpCurrent === 0) {
        boss.status = 'defeated';
        state.profile.title = `Apex Master of ${state.profile.targetRole}`;
      }
    }

    saveLocalDb(db);
    return { success: true, boss, profile: state.profile };
  },

  // Mentor Connect
  async getMentors(query?: { search?: string; role?: string }): Promise<(Mentor & { isConnected?: boolean })[]> {
    const params = new URLSearchParams();
    if (query?.search) params.set('search', query.search);
    if (query?.role) params.set('role', query.role);

    const serverResult = await requestWithFallback<(Mentor & { isConnected?: boolean })[]>(
      `/api/mentors?${params.toString()}`,
      { headers: getAuthHeaders() }
    );
    if (serverResult) return serverResult;

    const db = loadLocalDb();
    const { state } = resolveActiveLocalState(db);
    let list = [...db.mentors];

    if (query?.role && query.role !== 'all') {
      const r = query.role.toLowerCase();
      list = list.filter((m) => m.roleSpecialty.toLowerCase().includes(r) || m.skills.some((s) => s.toLowerCase().includes(r)));
    }

    if (query?.search) {
      const q = query.search.toLowerCase();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.company.toLowerCase().includes(q) ||
          m.roleSpecialty.toLowerCase().includes(q) ||
          m.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    const connectedSet = new Set(state.connectedMentors || []);
    return list.map((m) => ({
      ...m,
      isConnected: connectedSet.has(m.id),
    }));
  },

  async connectMentor(mentorId: string): Promise<{ success: boolean; connectedMentors: string[] }> {
    const serverResult = await requestWithFallback<{ success: boolean; connectedMentors: string[] }>(
      `/api/mentors/${mentorId}/connect`,
      { method: 'POST', headers: getAuthHeaders() }
    );
    if (serverResult) return serverResult;

    const db = loadLocalDb();
    const { user, state, userId } = resolveActiveLocalState(db);
    const mentor = db.mentors.find((m) => m.id === mentorId);
    if (!mentor) throw new Error('Mentor not found');

    if (!state.connectedMentors) state.connectedMentors = [];
    if (!state.connectedMentors.includes(mentorId)) {
      state.connectedMentors.push(mentorId);

      const studentName = user?.name || 'Fellow Engineer';
      db.messages.push({
        id: `msg-${Date.now()}`,
        senderId: mentorId,
        recipientId: userId,
        mentorId,
        senderRole: 'mentor',
        text: `Hi ${studentName}! Thanks for connecting. I'm excited to help you prepare for your target role in ${state.profile.targetRole}. Feel free to ask technical questions, request architecture feedback, or send any of your quest deliverables for review!`,
        timestamp: new Date().toISOString(),
      });
    }

    saveLocalDb(db);
    return { success: true, connectedMentors: state.connectedMentors };
  },

  async getMentorMessages(mentorId: string): Promise<MentorMessage[]> {
    const serverResult = await requestWithFallback<MentorMessage[]>(`/api/mentors/${mentorId}/messages`, {
      headers: getAuthHeaders(),
    });
    if (serverResult) return serverResult;

    const db = loadLocalDb();
    const { userId } = resolveActiveLocalState(db);
    return db.messages.filter(
      (m) =>
        m.mentorId === mentorId &&
        (m.senderId === userId || m.recipientId === userId || m.recipientId === 'guest' || m.senderId === 'guest')
    );
  },

  async sendMentorMessage(
    mentorId: string,
    payload: {
      text: string;
      attachedDeliverable?: {
        nodeTitle: string;
        artifactUrl: string;
        rubricNote?: string;
      };
    }
  ): Promise<{ userMessage: MentorMessage; mentorMessage: MentorMessage }> {
    const serverResult = await requestWithFallback<{ userMessage: MentorMessage; mentorMessage: MentorMessage }>(
      `/api/mentors/${mentorId}/messages`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      }
    );
    if (serverResult) return serverResult;

    const db = loadLocalDb();
    const { user, state, userId } = resolveActiveLocalState(db);
    const mentor = db.mentors.find((m) => m.id === mentorId);
    if (!mentor) throw new Error('Mentor not found');

    const userMsg: MentorMessage = {
      id: `msg-u-${Date.now()}`,
      senderId: userId,
      recipientId: mentorId,
      mentorId,
      senderRole: 'student',
      text: payload.text.trim(),
      timestamp: new Date().toISOString(),
      attachedDeliverable: payload.attachedDeliverable,
    };
    db.messages.push(userMsg);

    if (!state.connectedMentors) state.connectedMentors = [];
    if (!state.connectedMentors.includes(mentorId)) {
      state.connectedMentors.push(mentorId);
    }

    // High fidelity mentor feedback persona
    let replyText = `Thanks for reaching out! At ${mentor.company}, we place huge emphasis on demonstrable engineering rigor. Regarding your question: "${payload.text.trim().substring(0, 80)}...", make sure you measure performance before optimizing, and document your failure modes clearly.`;
    if (payload.attachedDeliverable) {
      replyText = `Great work on submitting "${payload.attachedDeliverable.nodeTitle}"! I reviewed the artifact at ${payload.attachedDeliverable.artifactUrl}. The architecture demonstrates solid foundational comprehension. For your next iteration, make sure to add automated regression benchmarks in CI. You are making real progress toward becoming a top-tier ${state.profile.targetRole}!`;
    }

    const mentorMsg: MentorMessage = {
      id: `msg-m-${Date.now() + 1}`,
      senderId: mentorId,
      recipientId: userId,
      mentorId,
      senderRole: 'mentor',
      text: replyText,
      timestamp: new Date(Date.now() + 600).toISOString(),
    };
    db.messages.push(mentorMsg);

    saveLocalDb(db);
    return { userMessage: userMsg, mentorMessage: mentorMsg };
  },

  async resetGuestProgress(): Promise<{ profile: CareerDNA; roadmap: CareerWorldData }> {
    const db = loadLocalDb();
    db.defaultState = createNewUserState('AI Research Engineer');
    saveLocalDb(db);
    return { profile: db.defaultState.profile, roadmap: db.defaultState.roadmap };
  },
};
