import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Google Gemini Client with required aistudio-build User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Database file setup
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const DB_FILE = path.join(DATA_DIR, 'ascendra_db.json');

// Types & Domain Generators
import { buildDomainRoadmap } from './src/services/domainRoadmaps';

// Resilient Multi-Model Gemini Caller with Tight Timeout & Graceful Recovery
async function generateWithGemini(
  prompt: string,
  schema?: any,
  timeoutMs = 4500
): Promise<any> {
  if (!process.env.GEMINI_API_KEY) return null;

  const modelsToTry = ['gemini-3.8-flash', 'gemini-flash-latest'];
  for (const model of modelsToTry) {
    try {
      const callPromise = ai.models.generateContent({
        model,
        contents: prompt,
        config: schema
          ? {
              responseMimeType: 'application/json',
              responseSchema: schema,
            }
          : undefined,
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms on ${model}`)), timeoutMs)
      );

      const response = (await Promise.race([callPromise, timeoutPromise])) as any;
      if (response && response.text) {
        if (schema) {
          try {
            return JSON.parse(response.text);
          } catch (pe) {
            console.warn(`JSON parse error on ${model} output:`, pe);
            continue;
          }
        }
        return response.text;
      }
    } catch (err: any) {
      console.warn(`Gemini attempt on ${model} failed (${err?.status || err?.message || 'unknown error'})`);
    }
  }
  return null;
}

// Types
import type {
  CareerDNA,
  RoadmapNode,
  RoadmapEdge,
  CareerWorldData,
  InventoryItem,
  BossBattle,
  User,
  Mentor,
  MentorMessage,
} from './src/types/career';

interface UserRecord {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  targetRole: string;
  avatarUrl?: string;
  createdAt: string;
}

interface UserState {
  profile: CareerDNA;
  roadmap: CareerWorldData;
  inventory: InventoryItem[];
  bossBattles: BossBattle[];
  connectedMentors: string[];
}

interface DatabaseSchema {
  users: UserRecord[];
  userStates: Record<string, UserState>;
  defaultState: UserState;
  mentors: Mentor[];
  messages: MentorMessage[];
}

// Initial Seed Data for "AI Research Engineer"
const INITIAL_PROFILE: CareerDNA = {
  targetRole: 'AI Research Engineer',
  targetRoleDescription: 'Designs, benchmarks, and implements deep learning architectures, transformer models, and scalable neural pipelines.',
  experienceLevel: 'intermediate',
  weeklyHours: 15,
  currentSkills: [
    { id: 's1', name: 'Python', category: 'Programming', verification: 'project_evidence', rating: 4, evidenceUrl: 'https://github.com/example/python-data-structures' },
    { id: 's2', name: 'Linear Algebra & Calculus', category: 'Mathematics', verification: 'assessed', rating: 3 },
    { id: 's3', name: 'NumPy & Pandas', category: 'Data Science', verification: 'project_evidence', rating: 4 },
    { id: 's4', name: 'PyTorch Basics', category: 'Deep Learning', verification: 'self_reported', rating: 2 },
  ],
  currentProjects: [
    { title: 'CIFAR-10 Residual ConvNet', description: 'Trained ResNet-18 variant achieving 91.4% test accuracy with data augmentations.', link: 'https://github.com/example/cifar-resnet' },
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
      brief: 'Write an numerically stable custom loss function addressing class imbalance, complete with torch.autograd.Function and memory pinning benchmark.',
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
        { id: 'r2', name: 'Failure Mode Categorization', weight: 35, description: 'Systematic diagnosis of halluncinations and syntax errors.', maxScore: 100 },
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
    description: 'A multi-phase trial synthesizing data curation, distributed LoRA fine-tuning, automated evaluation rigor, and low-latency quantization serving.',
    hpTotal: 4000,
    hpCurrent: 4000,
    requiredSkills: ['PyTorch CUDA Extensions', 'Transformer Architecture', 'FSDP Distributed Training', 'LLM Scientific Benchmarking'],
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

const DEMO_USER: UserRecord = {
  id: 'usr_demo_alex',
  email: 'alex@ascendra.dev',
  name: 'Alex Vance',
  passwordHash: 'demo1234',
  targetRole: 'AI Research Engineer',
  createdAt: '2026-10-01T00:00:00.000Z',
};

// Helper: Read DB
function loadDb(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      // Ensure all fields exist
      if (!parsed.mentors) parsed.mentors = SEED_MENTORS;
      if (!parsed.messages) parsed.messages = INITIAL_MESSAGES;
      if (!parsed.users) parsed.users = [];
      if (!parsed.userStates) parsed.userStates = {};
      if (!parsed.defaultState) {
        parsed.defaultState = {
          profile: INITIAL_PROFILE,
          roadmap: {
            targetRole: INITIAL_PROFILE.targetRole,
            nodes: INITIAL_NODES,
            edges: INITIAL_EDGES,
          },
          inventory: INITIAL_INVENTORY,
          bossBattles: INITIAL_BOSS_BATTLES,
          connectedMentors: ['mentor-elena'],
        };
      }
      if (!parsed.users.some((u: UserRecord) => u.email.toLowerCase() === DEMO_USER.email.toLowerCase())) {
        parsed.users.push(DEMO_USER);
      }
      if (!parsed.userStates[DEMO_USER.id]) {
        parsed.userStates[DEMO_USER.id] = parsed.defaultState;
      }
      return parsed;
    }
  } catch (err) {
    console.error('Error loading database, resetting to seed data:', err);
  }

  const initialDb: DatabaseSchema = {
    users: [DEMO_USER],
    userStates: {
      [DEMO_USER.id]: {
        profile: INITIAL_PROFILE,
        roadmap: {
          targetRole: INITIAL_PROFILE.targetRole,
          nodes: INITIAL_NODES,
          edges: INITIAL_EDGES,
        },
        inventory: INITIAL_INVENTORY,
        bossBattles: INITIAL_BOSS_BATTLES,
        connectedMentors: ['mentor-elena'],
      },
    },
    defaultState: {
      profile: INITIAL_PROFILE,
      roadmap: {
        targetRole: INITIAL_PROFILE.targetRole,
        nodes: INITIAL_NODES,
        edges: INITIAL_EDGES,
      },
      inventory: INITIAL_INVENTORY,
      bossBattles: INITIAL_BOSS_BATTLES,
      connectedMentors: ['mentor-elena'],
    },
    mentors: SEED_MENTORS,
    messages: INITIAL_MESSAGES,
  };
  saveDb(initialDb);
  return initialDb;
}

// Helper: Save DB
function saveDb(data: DatabaseSchema): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database:', err);
  }
}

// Helper: Resolve active User & State
function resolveUserState(req: Request, db: DatabaseSchema): { user: UserRecord | null; state: UserState; userId: string } {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const user = db.users.find((u) => u.id === token || `token_${u.id}` === token);
    if (user && db.userStates[user.id]) {
      return { user, state: db.userStates[user.id], userId: user.id };
    }
  }
  return { user: null, state: db.defaultState, userId: 'guest' };
}

// Deterministic Prerequisite Logic
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

// GET /api/gemini/status
app.get('/api/gemini/status', (req: Request, res: Response) => {
  res.json({
    status: 'operational',
    model: 'gemini-3.8-flash',
    hasKey: !!process.env.GEMINI_API_KEY,
    capabilities: [
      'Personalized 4-Tier Career World Structured Generation',
      'Adaptive Prerequisite Replanning Explanations',
      'AI Quest Mentoring & Architecture Hints',
      'Industry Staff Engineer Persona Responses in Mentor Connect',
    ],
  });
});

// ========================
// AUTHENTICATION ENDPOINTS
// ========================

// POST /api/auth/signup
app.post('/api/auth/signup', (req: Request, res: Response) => {
  const { email, password, name, targetRole } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const db = loadDb();
  const existingUser = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const userId = `usr_${Date.now()}`;
  const newUser: UserRecord = {
    id: userId,
    email: email.toLowerCase().trim(),
    name: name.trim(),
    passwordHash: password, // Simple demonstration auth store
    targetRole: targetRole || 'AI Research Engineer',
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);

  // Initialize fresh personalized state
  const userProfile: CareerDNA = {
    ...INITIAL_PROFILE,
    targetRole: newUser.targetRole,
    title: 'Tier I Initiate',
    xp: 0,
    level: 1,
    competenciesVerifiedCount: 0,
    currentSkills: [
      { id: `s-${Date.now()}-1`, name: 'Python', category: 'Core Tech', verification: 'self_reported', rating: 3 },
      { id: `s-${Date.now()}-2`, name: 'Git & Version Control', category: 'Tooling', verification: 'project_evidence', rating: 4 },
    ],
    currentProjects: [],
  };

  const userRoadmap: CareerWorldData = {
    targetRole: newUser.targetRole,
    nodes: INITIAL_NODES.map((n) => ({
      ...n,
      status: n.prerequisites.length === 0 ? 'available' : 'locked',
      completedAt: undefined,
      evidenceSubmitted: undefined,
    })),
    edges: INITIAL_EDGES,
    lastAdaptiveChange: {
      reason: `Account created for ${newUser.name}. Welcome to Ascendra!`,
      timestamp: new Date().toISOString(),
      affectedNodes: [],
      unlockedCount: INITIAL_NODES.filter((n) => n.prerequisites.length === 0).length,
    },
  };

  db.userStates[userId] = {
    profile: userProfile,
    roadmap: userRoadmap,
    inventory: [],
    bossBattles: INITIAL_BOSS_BATTLES,
    connectedMentors: ['mentor-elena'],
  };

  // Add a welcoming message from Dr. Elena
  db.messages.push({
    id: `msg-${Date.now()}`,
    senderId: 'mentor-elena',
    recipientId: userId,
    mentorId: 'mentor-elena',
    senderRole: 'mentor',
    text: `Hello ${newUser.name}! I noticed you started your journey toward becoming a ${newUser.targetRole}. I'm here to review your code deliverables and discuss system design whenever you need feedback. Let's build something extraordinary together!`,
    timestamp: new Date().toISOString(),
  });

  saveDb(db);

  res.status(201).json({
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      targetRole: newUser.targetRole,
      createdAt: newUser.createdAt,
    },
    token: newUser.id,
    profile: userProfile,
    roadmap: userRoadmap,
  });
});

// POST /api/auth/login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const db = loadDb();
  const user = db.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.passwordHash === password
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const userState = db.userStates[user.id] || db.defaultState;

  res.json({
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
  });
});

// GET /api/auth/me
app.get('/api/auth/me', (req: Request, res: Response) => {
  const db = loadDb();
  const { user, state } = resolveUserState(req, db);

  if (!user) {
    return res.json({
      user: null,
      profile: db.defaultState.profile,
      roadmap: db.defaultState.roadmap,
    });
  }

  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      targetRole: user.targetRole,
      createdAt: user.createdAt,
    },
    profile: state.profile,
    roadmap: state.roadmap,
  });
});

// POST /api/auth/logout
app.post('/api/auth/logout', (req: Request, res: Response) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// ========================
// CAREER DNA & WORLD APIS
// ========================

// GET /api/profile
app.get('/api/profile', (req: Request, res: Response) => {
  const db = loadDb();
  const { state } = resolveUserState(req, db);
  res.json(state.profile);
});

// POST /api/profile
app.post('/api/profile', (req: Request, res: Response) => {
  const db = loadDb();
  const { state } = resolveUserState(req, db);
  state.profile = { ...state.profile, ...req.body };
  saveDb(db);
  res.json(state.profile);
});

// GET /api/roadmap
app.get('/api/roadmap', (req: Request, res: Response) => {
  const db = loadDb();
  const { state } = resolveUserState(req, db);
  const { updatedNodes } = updateDeterministicProgression(state.roadmap.nodes);
  state.roadmap.nodes = updatedNodes;
  saveDb(db);
  res.json(state.roadmap);
});

// POST /api/roadmap/node/mark-known (Adaptive shortcut)
app.post('/api/roadmap/node/mark-known', async (req: Request, res: Response) => {
  const { nodeId, reason } = req.body;
  const db = loadDb();
  const { state } = resolveUserState(req, db);

  const targetNode = state.roadmap.nodes.find((n) => n.id === nodeId);
  if (!targetNode) {
    return res.status(404).json({ error: 'Node not found' });
  }

  // Mark node completed
  targetNode.status = 'completed';
  targetNode.completedAt = new Date().toISOString();
  if (!targetNode.evidenceSubmitted) {
    targetNode.evidenceSubmitted = {
      url: 'Self-Verified / Prior Experience',
      note: reason || 'Marked as already known through prior academic or professional experience.',
      submittedAt: new Date().toISOString(),
    };
  }

  // Re-run deterministic progression
  const { updatedNodes, newlyUnlockedIds } = updateDeterministicProgression(state.roadmap.nodes);
  state.roadmap.nodes = updatedNodes;

  // Add to inventory as self_reported / fast-tracked
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

  // Update profile XP & Title
  state.profile.xp += newInventoryItem.xpEarned;
  state.profile.level = Math.floor(state.profile.xp / 600) + 1;

  // Generate AI adaptive reason
  let aiReason = `Fast-tracked ${targetNode.title}. Prerequisite checks re-evaluated: unlocked ${newlyUnlockedIds.length} dependent nodes.`;
  try {
    if (process.env.GEMINI_API_KEY) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `The student marked the skill node "${targetNode.title}" as already known. 
        As the Ascendra Career Engine, provide a concise 2-sentence encouraging tactical career explanation describing how skipping this prerequisite accelerates their path toward becoming a "${state.profile.targetRole}", and what they should focus on next given that nodes [${newlyUnlockedIds.join(', ')}] are now accessible. Keep it professional, motivating, and grounded.`,
      });
      if (response.text) {
        aiReason = response.text.trim();
      }
    }
  } catch (err) {
    console.error('Gemini adaptive reasoning error:', err);
  }

  state.roadmap.lastAdaptiveChange = {
    reason: aiReason,
    timestamp: new Date().toISOString(),
    affectedNodes: newlyUnlockedIds,
    unlockedCount: newlyUnlockedIds.length,
  };

  saveDb(db);

  res.json({
    success: true,
    roadmap: state.roadmap,
    profile: state.profile,
    adaptiveNotice: state.roadmap.lastAdaptiveChange,
  });
});

// POST /api/quest/:nodeId/complete
app.post('/api/quest/:nodeId/complete', (req: Request, res: Response) => {
  const { nodeId } = req.params;
  const { evidenceUrl, note, rubricScores, verificationType = 'project_evidence' } = req.body;
  const db = loadDb();
  const { state } = resolveUserState(req, db);

  const node = state.roadmap.nodes.find((n) => n.id === nodeId);
  if (!node) {
    return res.status(404).json({ error: 'Node not found' });
  }

  // Mark node as completed
  node.status = 'completed';
  node.completedAt = new Date().toISOString();
  node.evidenceSubmitted = {
    url: evidenceUrl || 'Verified in Quest Sandbox',
    note: note || 'Successfully met all rubric deliverables.',
    rubricScores: rubricScores || {},
    submittedAt: new Date().toISOString(),
  };

  // Add XP
  const xpGained = node.quest.xpReward || 500;
  state.profile.xp += xpGained;
  const previousLevel = state.profile.level;
  state.profile.level = Math.floor(state.profile.xp / 600) + 1;
  const leveledUp = state.profile.level > previousLevel;

  if (verificationType === 'project_evidence' || verificationType === 'assessed') {
    state.profile.competenciesVerifiedCount += 1;
  }

  if (state.profile.level >= 8) {
    state.profile.title = 'Principal Forge Architect';
  } else if (state.profile.level >= 5) {
    state.profile.title = 'Senior Systems Artisan';
  } else if (state.profile.level >= 3) {
    state.profile.title = 'Tensor Journeyman';
  }

  // Add to Inventory
  const newInventoryItem: InventoryItem = {
    id: `inv-${Date.now()}`,
    nodeId: node.id,
    title: node.title,
    category: node.category,
    verification: verificationType,
    deliverableType: node.quest.deliverableType,
    artifactUrl: evidenceUrl || 'https://github.com/student/verified-deliverable',
    notes: note || `Deliverable submitted for ${node.title}. Evaluated against rubric.`,
    dateAdded: new Date().toISOString().split('T')[0],
    xpEarned: xpGained,
  };
  state.inventory.unshift(newInventoryItem);

  // Deterministic unlock of downstream nodes
  const { updatedNodes, newlyUnlockedIds } = updateDeterministicProgression(state.roadmap.nodes);
  state.roadmap.nodes = updatedNodes;

  // Check if Boss Battle unlocked
  if (state.bossBattles.length > 0) {
    const boss = state.bossBattles[0];
    const bossNode = state.roadmap.nodes.find((n) => n.category === 'boss_battle');
    if (bossNode && (bossNode.status === 'available' || bossNode.status === 'active')) {
      boss.status = 'unlocked';
    }
  }

  saveDb(db);

  res.json({
    success: true,
    node,
    xpGained,
    leveledUp,
    newLevel: state.profile.level,
    newlyUnlockedIds,
    inventoryItem: newInventoryItem,
    roadmap: state.roadmap,
    profile: state.profile,
  });
});

// POST /api/quest/:nodeId/ai-hint
app.post('/api/quest/:nodeId/ai-hint', async (req: Request, res: Response) => {
  const { nodeId } = req.params;
  const { question } = req.body;
  const db = loadDb();
  const { state } = resolveUserState(req, db);

  const node = state.roadmap.nodes.find((n) => n.id === nodeId);
  if (!node) {
    return res.status(404).json({ error: 'Node not found' });
  }

  let advice = `Focus on verifying input validation and edge cases for "${node.title}". Structure your "${node.quest.tangibleDeliverable}" with clear modular abstractions, repeatable benchmark harnesses, and regression test suites.`;

  try {
    const prompt = `You are the Ascendra AI Quest Coach assisting a student who is preparing for the role of "${state.profile.targetRole}".
The current quest is: "${node.title}".
Objective: ${node.quest.objective}
Deliverable: ${node.quest.tangibleDeliverable}
Student query/blocker: "${question || 'How should I structure the deliverable to excel at the evaluation rubric?'}"

Provide concise, highly actionable technical engineering guidance (3-4 bullet points) explaining architectural best practices, testing strategies, and what hiring managers look for in this deliverable. Ground your advice in real production standards. Avoid vague fluff.`;

    const resText = await generateWithGemini(prompt, undefined, 7000);
    if (resText) {
      advice = resText.trim();
    }
  } catch (err) {
    console.warn('AI Hint fallback triggered:', err);
  }

  res.json({ advice });
});

// POST /api/roadmap/generate (Generative AI structured generation with multi-criteria personalization)
app.post('/api/roadmap/generate', async (req: Request, res: Response) => {
  const {
    targetRole,
    specializationSubTrack,
    weeklyHours,
    experienceLevel,
    currentSkills,
    currentProjects,
    timelineMonths,
    learningStyle,
    preferredDeliverable,
    targetCompanyTier,
    masteredTopicsToSkip,
    priorityWeaknesses,
  } = req.body;

  const db = loadDb();
  const { state } = resolveUserState(req, db);

  // Update profile with all personalized criteria
  state.profile.targetRole = targetRole || state.profile.targetRole;
  state.profile.weeklyHours = Number(weeklyHours) || state.profile.weeklyHours;
  state.profile.experienceLevel = experienceLevel || state.profile.experienceLevel;
  if (specializationSubTrack) state.profile.specializationSubTrack = specializationSubTrack;
  if (timelineMonths) state.profile.timelineMonths = Number(timelineMonths);
  if (learningStyle) state.profile.learningStyle = learningStyle;
  if (preferredDeliverable) state.profile.preferredDeliverable = preferredDeliverable;
  if (targetCompanyTier) state.profile.targetCompanyTier = targetCompanyTier;
  if (masteredTopicsToSkip) state.profile.masteredTopicsToSkip = masteredTopicsToSkip;
  if (priorityWeaknesses) state.profile.priorityWeaknesses = priorityWeaknesses;
  if (currentSkills && Array.isArray(currentSkills)) state.profile.currentSkills = currentSkills;
  if (currentProjects && Array.isArray(currentProjects)) state.profile.currentProjects = currentProjects;

  let generatedNodes: RoadmapNode[] = [];
  let generatedEdges: RoadmapEdge[] = [];
  let generatedBossBattle: BossBattle | null = null;

  // 1. Attempt AI Generation with Gemini (structured schema)
  try {
    const aiPrompt = `You are the Ascendra Career World Architect. Create a deeply personalized, branching RPG skill tree and career roadmap for a student aiming for the target role: "${state.profile.targetRole}".
Personalized student profile:
- Target Role: ${state.profile.targetRole}
- Specialization Sub-Track: ${specializationSubTrack || 'Core Specialist'}
- Target Company Profile: ${targetCompanyTier || 'Industry Standard'}
- Target Timeline: ${timelineMonths || 6} months
- Dedicated Weekly Time: ${weeklyHours || state.profile.weeklyHours} hours/week
- Experience Level: ${experienceLevel || state.profile.experienceLevel}
- Learning Modality: ${learningStyle || 'code_first practical'}
- Preferred Deliverable: ${preferredDeliverable || 'github_repo'}
- Existing Skills: ${JSON.stringify(currentSkills || state.profile.currentSkills || [])}
- Existing Projects: ${JSON.stringify(currentProjects || state.profile.currentProjects || [])}
- Mastered Topics to Fast-Track/Skip: ${JSON.stringify(masteredTopicsToSkip || [])}
- Priority Weaknesses / Focus Areas: ${JSON.stringify(priorityWeaknesses || [])}

Generate a strictly structured roadmap with 6-8 interconnected nodes spanning 4 Tiers:
- Tier 1: Foundational engineering & math
- Tier 2: Core domain architecture & frameworks
- Tier 3: Advanced distributed/evaluation systems
- Tier 4: Boss Battle Capstone (category must be "boss_battle")

Each node must have:
- id: unique string (e.g. "node-1")
- title: concise technical title specifically tailored to ${state.profile.targetRole} (${specializationSubTrack || ''})
- subtitle: short technical focus
- tier: number (1 to 4)
- category: one of ["skill", "project", "assessment", "milestone", "boss_battle"]
- prerequisites: array of prerequisite node ids (Tier 1 nodes must have empty array [])
- estimatedHours: realistic integer hours calculated for ${weeklyHours || state.profile.weeklyHours} hrs/week
- position: { x: number, y: number } (layout in 4 horizontal columns: Tier 1 at x=80, Tier 2 at x=380, Tier 3 at x=680, Tier 4 at x=960, varying y between 160 and 440)
- quest: object with:
  - objective: specific technical task tailored to ${state.profile.targetRole}
  - brief: description of challenge
  - steps: 3 string steps
  - tangibleDeliverable: concrete artifact (e.g. GitHub repository, benchmark report, live demo)
  - deliverableType: one of ["github_repo", "live_demo", "benchmark_report", "architecture_diagram", "code_review"]
  - rubric: array of 3 criteria with id, name, weight (sum to 100), description, maxScore: 100
  - curatedResources: array of 2 resources with title, url, type ("documentation"|"paper"|"guide")
  - interviewQuestions: array of 2 technical interview questions
  - xpReward: integer XP (300 to 1000 for regular, 2000 for boss_battle)
  - estimatedHours: integer

Also generate an array of edges connecting prerequisites to targets (source -> target).`;

    const parsed = await generateWithGemini(aiPrompt, {
      type: Type.OBJECT,
      properties: {
        targetRole: { type: Type.STRING },
        roleDescription: { type: Type.STRING },
        nodes: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              subtitle: { type: Type.STRING },
              tier: { type: Type.INTEGER },
              category: { type: Type.STRING },
              prerequisites: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              estimatedHours: { type: Type.INTEGER },
              position: {
                type: Type.OBJECT,
                properties: {
                  x: { type: Type.NUMBER },
                  y: { type: Type.NUMBER },
                },
                required: ['x', 'y'],
              },
              quest: {
                type: Type.OBJECT,
                properties: {
                  objective: { type: Type.STRING },
                  brief: { type: Type.STRING },
                  steps: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  tangibleDeliverable: { type: Type.STRING },
                  deliverableType: { type: Type.STRING },
                  rubric: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        name: { type: Type.STRING },
                        weight: { type: Type.NUMBER },
                        description: { type: Type.STRING },
                        maxScore: { type: Type.NUMBER },
                      },
                      required: ['id', 'name', 'weight', 'description', 'maxScore'],
                    },
                  },
                  curatedResources: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        url: { type: Type.STRING },
                        type: { type: Type.STRING },
                      },
                      required: ['title', 'url', 'type'],
                    },
                  },
                  interviewQuestions: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  xpReward: { type: Type.INTEGER },
                  estimatedHours: { type: Type.INTEGER },
                },
                required: ['objective', 'brief', 'steps', 'tangibleDeliverable', 'deliverableType', 'rubric', 'curatedResources', 'interviewQuestions', 'xpReward', 'estimatedHours'],
              },
            },
            required: ['id', 'title', 'subtitle', 'tier', 'category', 'prerequisites', 'estimatedHours', 'position', 'quest'],
          },
        },
        edges: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              source: { type: Type.STRING },
              target: { type: Type.STRING },
            },
            required: ['id', 'source', 'target'],
          },
        },
      },
      required: ['targetRole', 'nodes', 'edges'],
    }, 11000);

    if (parsed && parsed.nodes && parsed.nodes.length > 0) {
      if (parsed.roleDescription) {
        state.profile.targetRoleDescription = parsed.roleDescription;
      }
      generatedNodes = parsed.nodes.map((n: any) => ({
        ...n,
        status: (!n.prerequisites || n.prerequisites.length === 0) ? 'available' : 'locked',
      }));
      generatedEdges = (parsed.edges || []).map((e: any) => ({
        ...e,
        animated: true,
      }));
    }
  } catch (err) {
    console.warn('AI structured generation fell back to domain generator:', err);
  }

  // 2. If Gemini generation was unavailable or timed out, use intelligent domain generator
  if (generatedNodes.length === 0) {
    const domainResult = buildDomainRoadmap({
      targetRole: state.profile.targetRole,
      specializationSubTrack,
      weeklyHours: state.profile.weeklyHours,
      experienceLevel: state.profile.experienceLevel,
      currentSkills: state.profile.currentSkills,
      currentProjects: state.profile.currentProjects,
      timelineMonths,
      learningStyle,
      preferredDeliverable,
      targetCompanyTier,
      masteredTopicsToSkip,
      priorityWeaknesses,
    });

    generatedNodes = domainResult.nodes;
    generatedEdges = domainResult.edges;
    generatedBossBattle = domainResult.bossBattle;
    state.profile.targetRoleDescription = domainResult.roleDescription;
  }

  // 3. Mark pre-existing verified competencies as completed & unlock frontier
  const knownTokens = new Set<string>();
  (state.profile.currentSkills || []).forEach((s) => {
    if (s.rating >= 3 || s.verification !== 'self_reported') {
      s.name.toLowerCase().split(/[\s,+/&]+/).forEach((t) => { if (t.length > 2) knownTokens.add(t); });
    }
  });
  (masteredTopicsToSkip || []).forEach((topic: string) => {
    topic.toLowerCase().split(/[\s,+/&]+/).forEach((t) => { if (t.length > 2) knownTokens.add(t); });
  });

  generatedNodes = generatedNodes.map((n, idx) => {
    if (n.status === 'completed') return n;
    const nodeText = `${n.title} ${n.subtitle}`.toLowerCase();
    const isKnown = n.tier === 1 && Array.from(knownTokens).some((token) => nodeText.includes(token));
    if (isKnown) {
      const matchSkill = state.profile.currentSkills.find((s) => nodeText.includes(s.name.toLowerCase()));
      return {
        ...n,
        status: 'completed',
        completedAt: new Date(Date.now() - 86400000 * (4 - idx)).toISOString().split('T')[0],
        evidenceSubmitted: {
          url: matchSkill?.evidenceUrl || 'Verified baseline in Career DNA',
          note: `Skill validated via student profile: ${matchSkill?.name || n.title}. Prerequisite met.`,
          submittedAt: new Date().toISOString(),
        },
      };
    }
    return n;
  });

  const { updatedNodes } = updateDeterministicProgression(generatedNodes);

  state.roadmap = {
    targetRole: state.profile.targetRole,
    nodes: updatedNodes,
    edges: generatedEdges,
    lastAdaptiveChange: {
      reason: `Personalized Career World forged for "${state.profile.targetRole}"${specializationSubTrack ? ` (${specializationSubTrack})` : ''} calibrated to ${state.profile.weeklyHours}h/week dedication over ${timelineMonths || 6} months.`,
      timestamp: new Date().toISOString(),
      affectedNodes: updatedNodes.map((n) => n.id),
      unlockedCount: updatedNodes.filter((n) => n.status === 'available').length,
    },
  };

  if (!generatedBossBattle) {
    generatedBossBattle = {
      id: `boss-${Date.now()}`,
      title: `${state.profile.targetRole} Apex Capstone Challenge`,
      codename: `OP: ${state.profile.targetRole.toUpperCase().replace(/\s+/g, '_')}_APEX`,
      description: `Synthesize production systems, scientific evaluation, and scalable deployment for the ${state.profile.targetRole}${specializationSubTrack ? ` (${specializationSubTrack})` : ''} specialization.`,
      hpTotal: 4000,
      hpCurrent: 4000,
      requiredSkills: updatedNodes.slice(0, 4).map((n) => n.title),
      phases: [
        { id: 'p1', title: 'Phase 1: Architecture Specification', deliverable: 'System design RFC and interface contracts', completed: false, xp: 500 },
        { id: 'p2', title: 'Phase 2: Core Implementation', deliverable: 'Production codebase with test suite', completed: false, xp: 500 },
        { id: 'p3', title: 'Phase 3: Rigorous Benchmarks', deliverable: 'Performance and reliability validation report', completed: false, xp: 500 },
        { id: 'p4', title: 'Phase 4: Live Deployment', deliverable: 'Publicly reachable prototype or artifact', completed: false, xp: 500 },
      ],
      status: 'locked',
      lootSummary: `Verified ${state.profile.targetRole} Elite Credential, Capstone Blueprint, +2000 XP`,
      xpReward: 2000,
    };
  }

  state.bossBattles = [generatedBossBattle];

  saveDb(db);

  res.json({
    success: true,
    roadmap: state.roadmap,
    profile: state.profile,
    bossBattles: state.bossBattles,
  });
});

// GET /api/inventory
app.get('/api/inventory', (req: Request, res: Response) => {
  const db = loadDb();
  const { state } = resolveUserState(req, db);
  res.json(state.inventory);
});

// POST /api/inventory
app.post('/api/inventory', (req: Request, res: Response) => {
  const db = loadDb();
  const { state } = resolveUserState(req, db);
  const newItem: InventoryItem = {
    id: `inv-${Date.now()}`,
    ...req.body,
    dateAdded: new Date().toISOString().split('T')[0],
  };
  state.inventory.unshift(newItem);
  state.profile.xp += newItem.xpEarned || 200;
  state.profile.level = Math.floor(state.profile.xp / 600) + 1;
  saveDb(db);
  res.json(newItem);
});

// GET /api/boss-battles
app.get('/api/boss-battles', (req: Request, res: Response) => {
  const db = loadDb();
  const { state } = resolveUserState(req, db);
  res.json(state.bossBattles);
});

// POST /api/boss-battles/strike (complete a phase)
app.post('/api/boss-battles/strike', (req: Request, res: Response) => {
  const { bossId, phaseId, evidenceUrl, notes } = req.body;
  const db = loadDb();
  const { state } = resolveUserState(req, db);

  const boss = state.bossBattles.find((b) => b.id === bossId) || state.bossBattles[0];
  if (!boss) {
    return res.status(404).json({ error: 'Boss not found' });
  }

  const phase = boss.phases.find((p) => p.id === phaseId);
  if (!phase) {
    return res.status(404).json({ error: 'Phase not found' });
  }

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
      artifactUrl: evidenceUrl || 'https://github.com/student/boss-battle-artifact',
      notes: notes || `Completed phase deliverable: ${phase.deliverable}`,
      dateAdded: new Date().toISOString().split('T')[0],
      xpEarned: phase.xp,
    });

    if (boss.hpCurrent === 0) {
      boss.status = 'defeated';
      state.profile.title = `Apex Master of ${state.profile.targetRole}`;
    }
  }

  saveDb(db);

  res.json({
    success: true,
    boss,
    profile: state.profile,
  });
});

// ========================
// MENTOR CONNECT ENDPOINTS
// ========================

// GET /api/mentors
app.get('/api/mentors', (req: Request, res: Response) => {
  const db = loadDb();
  const { state } = resolveUserState(req, db);
  const { search, role } = req.query;

  let mentors = [...db.mentors];

  if (role && typeof role === 'string' && role !== 'all') {
    const roleLower = role.toLowerCase();
    mentors = mentors.filter(
      (m) =>
        m.roleSpecialty.toLowerCase().includes(roleLower) ||
        m.skills.some((s) => s.toLowerCase().includes(roleLower))
    );
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    mentors = mentors.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.company.toLowerCase().includes(q) ||
        m.roleSpecialty.toLowerCase().includes(q) ||
        m.bio.toLowerCase().includes(q) ||
        m.skills.some((s) => s.toLowerCase().includes(q))
    );
  }

  // Attach connected status
  const connectedSet = new Set(state.connectedMentors || []);
  const enrichedMentors = mentors.map((m) => ({
    ...m,
    isConnected: connectedSet.has(m.id),
  }));

  res.json(enrichedMentors);
});

// POST /api/mentors/:mentorId/connect
app.post('/api/mentors/:mentorId/connect', (req: Request, res: Response) => {
  const { mentorId } = req.params;
  const db = loadDb();
  const { user, state, userId } = resolveUserState(req, db);

  const mentor = db.mentors.find((m) => m.id === mentorId);
  if (!mentor) {
    return res.status(404).json({ error: 'Mentor not found' });
  }

  if (!state.connectedMentors) {
    state.connectedMentors = [];
  }

  if (!state.connectedMentors.includes(mentorId)) {
    state.connectedMentors.push(mentorId);

    // Initial greeting from mentor
    const studentName = user?.name || 'Fellow Engineer';
    const initialText = `Hi ${studentName}! Thanks for connecting. I'm excited to help you prepare for your target role in ${state.profile.targetRole}. Feel free to ask technical questions, request architecture feedback, or send any of your quest deliverables for review!`;

    db.messages.push({
      id: `msg-${Date.now()}`,
      senderId: mentorId,
      recipientId: userId,
      mentorId,
      senderRole: 'mentor',
      text: initialText,
      timestamp: new Date().toISOString(),
    });
  }

  saveDb(db);

  res.json({ success: true, connectedMentors: state.connectedMentors });
});

// GET /api/mentors/:mentorId/messages
app.get('/api/mentors/:mentorId/messages', (req: Request, res: Response) => {
  const { mentorId } = req.params;
  const db = loadDb();
  const { userId } = resolveUserState(req, db);

  // Return messages between this user and this mentor
  const userMessages = db.messages.filter(
    (m) =>
      m.mentorId === mentorId &&
      (m.senderId === userId || m.recipientId === userId || m.recipientId === 'guest' || m.senderId === 'guest')
  );

  res.json(userMessages);
});

// POST /api/mentors/:mentorId/messages (Send message & AI mentor response)
app.post('/api/mentors/:mentorId/messages', async (req: Request, res: Response) => {
  const { mentorId } = req.params;
  const { text, attachedDeliverable } = req.body;
  const db = loadDb();
  const { user, state, userId } = resolveUserState(req, db);

  const mentor = db.mentors.find((m) => m.id === mentorId);
  if (!mentor) {
    return res.status(404).json({ error: 'Mentor not found' });
  }

  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Message text is required' });
  }

  // 1. Save user's message
  const userMsg: MentorMessage = {
    id: `msg-u-${Date.now()}`,
    senderId: userId,
    recipientId: mentorId,
    mentorId,
    senderRole: 'student',
    text: text.trim(),
    timestamp: new Date().toISOString(),
    attachedDeliverable,
  };
  db.messages.push(userMsg);

  // Auto connect if not connected
  if (!state.connectedMentors) state.connectedMentors = [];
  if (!state.connectedMentors.includes(mentorId)) {
    state.connectedMentors.push(mentorId);
  }

  // 2. Generate authentic mentor response using Gemini with persona fallback
  let mentorReplyText = `Hi! As an engineer at ${mentor.company}, I'm glad to see you tackling "${state.profile.targetRole}". In production environments, ensuring clean interface contracts, reproducible test suites, and measurable benchmarks is what sets candidates apart. Keep pushing on your deliverables, and let me know if you run into any specific architectural bottlenecks!`;

  try {
    let prompt = `You are ${mentor.name}, ${mentor.title} at ${mentor.company}.
Your background: ${mentor.bio}
Your core technical domains: ${mentor.skills.join(', ')}.

You are mentoring a technology student named ${user?.name || 'the student'} who is aiming for the target role: "${state.profile.targetRole}".
The student's current Career Level is ${state.profile.level} (${state.profile.title}) with ${state.profile.xp} XP.

The student has just sent you this message:
"${text.trim()}"`;

    if (attachedDeliverable) {
      prompt += `\n\nThe student also attached their quest deliverable for your review:
- Quest: ${attachedDeliverable.nodeTitle}
- Artifact URL: ${attachedDeliverable.artifactUrl}
- Engineering note: ${attachedDeliverable.rubricNote || 'None provided'}`;
    }

    prompt += `\n\nRespond directly as ${mentor.name}. Provide a warm, concise, and technically grounded response (2-3 paragraphs) giving real-world industry feedback, architectural suggestions, or code review advice. Ground your feedback in high-standard engineering practices from your company (${mentor.company}). Do not write greetings like 'Dear' or sign off repeatedly like a letter; write as a real chat conversation.`;

    const resText = await generateWithGemini(prompt, undefined, 8000);
    if (resText) {
      mentorReplyText = resText.trim();
    }
  } catch (err) {
    console.warn('Mentor response generation fallback triggered:', err);
  }

  // 3. Save mentor's response
  const mentorMsg: MentorMessage = {
    id: `msg-m-${Date.now() + 1}`,
    senderId: mentorId,
    recipientId: userId,
    mentorId,
    senderRole: 'mentor',
    text: mentorReplyText,
    timestamp: new Date(Date.now() + 1000).toISOString(),
  };
  db.messages.push(mentorMsg);

  saveDb(db);

  res.json({
    userMessage: userMsg,
    mentorMessage: mentorMsg,
  });
});

// Vite Middleware for Dev or Static files for Prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Ascendra server is operational on http://0.0.0.0:${PORT}`);
  });
}

startServer();
