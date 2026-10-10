import type {
  RoadmapNode,
  RoadmapEdge,
  BossBattle,
  SkillItem,
  StudentProject,
} from '../types/career';

export interface RoadmapGenerationContext {
  targetRole: string;
  specializationSubTrack?: string;
  weeklyHours: number;
  experienceLevel: string;
  currentSkills: SkillItem[];
  currentProjects: StudentProject[];
  timelineMonths?: number;
  learningStyle?: string;
  preferredDeliverable?: string;
  targetCompanyTier?: string;
  masteredTopicsToSkip?: string[];
  priorityWeaknesses?: string[];
}

export function buildDomainRoadmap(ctx: RoadmapGenerationContext): {
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
  bossBattle: BossBattle;
  roleDescription: string;
} {
  const roleLower = (ctx.targetRole || '').toLowerCase();
  const subTrack = ctx.specializationSubTrack || '';
  const hoursPerWeek = Math.max(5, ctx.weeklyHours || 15);
  const timeline = ctx.timelineMonths || 6;
  const deliverableType = (ctx.preferredDeliverable as any) || 'github_repo';

  // Scale node hours realistically: Total hours = hoursPerWeek * timeline * 4.3 weeks
  // Spread over 6-8 nodes:
  const scaleHours = (base: number) => {
    const factor = hoursPerWeek / 15;
    return Math.max(6, Math.min(60, Math.round(base * factor)));
  };

  let template: {
    description: string;
    bossTitle: string;
    bossCodename: string;
    bossDescription: string;
    bossPhases: { id: string; title: string; deliverable: string; xp: number }[];
    nodes: Omit<RoadmapNode, 'status' | 'completedAt' | 'evidenceSubmitted'>[];
    edges: RoadmapEdge[];
  };

  if (roleLower.includes('autonomous') || roleLower.includes('robot') || roleLower.includes('embedded')) {
    // 1. Autonomous Systems & Robotics
    template = {
      description: `Designs and builds resilient real-time robotics software spanning sensor fusion, state estimation, ROS 2 topologies, and autonomous path planning${subTrack ? ` with specialization in ${subTrack}` : ''}.`,
      bossTitle: `${ctx.targetRole}: Autonomous Physical Test Core`,
      bossCodename: 'OP: VECTOR-CHASSIS-APEX',
      bossDescription: 'Full hardware-in-the-loop simulation integrating LiDAR SLAM, EKF state estimation, and model predictive control under dynamic obstacle stress.',
      bossPhases: [
        { id: 'p1', title: 'Phase 1: Deterministic Real-Time ROS 2 Pipeline', deliverable: 'Zero-copy intra-process message node graph with latency benchmarks', xp: 500 },
        { id: 'p2', title: 'Phase 2: 9-DOF IMU & Odometry EKF Fusion', deliverable: 'Filter convergence plots comparing ground-truth trajectory with covariance bounds', xp: 500 },
        { id: 'p3', title: 'Phase 3: 3D Point-Cloud LiDAR Feature Extraction', deliverable: 'Real-time NDT/ICP scan matcher processing 20Hz point clouds', xp: 500 },
        { id: 'p4', title: 'Phase 4: Dynamic Obstacle MPC Navigation', deliverable: 'Hardware-in-the-loop simulated run navigating adversarial moving hazards', xp: 500 },
      ],
      nodes: [
        {
          id: 'node-cpp-concurrency',
          title: 'Modern C++20 Systems & Memory Optimization',
          subtitle: 'Zero-overhead abstractions, RAII, move semantics & SIMD',
          tier: 1,
          category: 'skill',
          prerequisites: [],
          estimatedHours: scaleHours(10),
          position: { x: 80, y: 160 },
          quest: {
            objective: 'Build a lock-free ring buffer queue for high-rate sensor streams.',
            brief: 'Implement a lock-free single-producer single-consumer circular queue in C++20 using atomic memory fences and cache-line padding.',
            steps: [
              'Design ring buffer data structure with std::atomic read/write pointers.',
              'Apply cache-line alignment (hardware_destructive_interference_size) to prevent false sharing.',
              'Benchmark multi-threaded throughput with Google Benchmark against mutex-based queue.',
            ],
            tangibleDeliverable: 'GitHub repository with C++20 benchmark suite and ThreadSanitizer clean report.',
            deliverableType: 'github_repo',
            rubric: [
              { id: 'r1', name: 'Lock-Free Correctness', weight: 40, description: 'No data races verified via TSan and ThreadSanitizer.', maxScore: 100 },
              { id: 'r2', name: 'Cache-Line Optimization', weight: 30, description: 'Zero false sharing verified by CPU cache-miss counters.', maxScore: 100 },
              { id: 'r3', name: 'Benchmark Rigor', weight: 30, description: 'Statistically repeatable speedup over std::mutex.', maxScore: 100 },
            ],
            curatedResources: [
              { title: 'C++ Concurrency in Action (Anthony Williams)', url: 'https://www.manning.com/books/c-plus-plus-concurrency-in-action-second-edition', type: 'guide' },
              { title: 'Lock-Free Programming with C++11/20 Atomics', url: 'https://preshing.com/20120612/an-introduction-to-lock-free-programming/', type: 'documentation' },
            ],
            interviewQuestions: [
              'Explain the difference between std::memory_order_seq_cst and std::memory_order_acquire/release.',
              'How does hardware false sharing degrade multi-threaded sensor ingestion?',
            ],
            xpReward: 400,
            estimatedHours: scaleHours(10),
          },
        },
        {
          id: 'node-linear-state-space',
          title: 'Linear State-Space & Covariance Mathematics',
          subtitle: 'Multivariate Gaussians, Jacobians & Kalman formulation',
          tier: 1,
          category: 'assessment',
          prerequisites: [],
          estimatedHours: scaleHours(8),
          position: { x: 80, y: 340 },
          quest: {
            objective: 'Implement 1D and 2D Kalman filters from first principles.',
            brief: 'Derive prediction and update state equations, compute Kalman gains, and verify error covariance propagation on noisy telemetry.',
            steps: [
              'Derive state transition matrix F and measurement matrix H.',
              'Simulate Gaussian noise on ground truth trajectory.',
              'Calculate innovations and plot covariance ellipse shrinkage over time.',
            ],
            tangibleDeliverable: 'Interactive Jupyter diagnostic notebook with mathematical proofs and error plots.',
            deliverableType: 'benchmark_report',
            rubric: [
              { id: 'r1', name: 'Mathematical Derivation', weight: 40, description: 'Rigorous derivation of Kalman gain minimizing state variance.', maxScore: 100 },
              { id: 'r2', name: 'Covariance Stability', weight: 30, description: 'Positive semi-definite matrix validation throughout simulation.', maxScore: 100 },
              { id: 'r3', name: 'Noise Resilience', weight: 30, description: 'RMS error reduction demonstrated on simulated noisy GPS signals.', maxScore: 100 },
            ],
            curatedResources: [
              { title: 'Kalman and Bayesian Filters in Python (Labbe)', url: 'https://github.com/rlabbe/Kalman-and-Bayesian-Filters-in-Python', type: 'guide' },
              { title: 'Probabilistic Robotics (Thrun, Burgard, Fox)', url: 'https://mitpress.mit.edu/9780262201629/probabilistic-robotics/', type: 'paper' },
            ],
            interviewQuestions: [
              'How do you handle unmodeled external disturbances in the process noise covariance matrix Q?',
              'What happens to the Kalman gain when measurement uncertainty R approaches zero?',
            ],
            xpReward: 450,
            estimatedHours: scaleHours(8),
          },
        },
        {
          id: 'node-ros2-middleware',
          title: 'Real-Time ROS 2 Node Topology & DDS QoS',
          subtitle: 'Custom messages, executor threads & cyclonedds profiling',
          tier: 2,
          category: 'skill',
          prerequisites: ['node-cpp-concurrency'],
          estimatedHours: scaleHours(14),
          position: { x: 380, y: 160 },
          quest: {
            objective: 'Construct a deterministic multi-threaded ROS 2 sensor pipeline.',
            brief: 'Create sensor publisher and subscriber nodes using ROS 2 Galactic/Humble with custom QoS profiles for lossy wireless vs reliable wired channels.',
            steps: [
              'Implement custom telemetry interfaces in ros2_control compliant format.',
              'Configure CycloneDDS / FastDDS QoS policies (History: KeepLast, Reliability: BestEffort).',
              'Profile round-trip latency under 1000 msg/sec synthetic network load.',
            ],
            tangibleDeliverable: 'Working ROS 2 package repository with Docker container and QoS benchmark report.',
            deliverableType: 'github_repo',
            rubric: [
              { id: 'r1', name: 'QoS Calibration', weight: 40, description: 'Zero packet drop under sustained high-frequency telemetry.', maxScore: 100 },
              { id: 'r2', name: 'Executor Determinism', weight: 30, description: 'Deterministic callback scheduling without thread starvation.', maxScore: 100 },
              { id: 'r3', name: 'Reproducibility', weight: 30, description: 'One-line Dockerized build with automated launch testing.', maxScore: 100 },
            ],
            curatedResources: [
              { title: 'ROS 2 Design Documentation & QoS Concepts', url: 'https://design.ros2.org/articles/qos.html', type: 'documentation' },
              { title: 'Real-Time ROS 2 Best Practices (ROS2 TSC)', url: 'https://docs.ros.org/en/humble/Tutorials/Miscellaneous/Building-Realtime-rt_preempt-kernel-for-ROS-2.html', type: 'guide' },
            ],
            interviewQuestions: [
              'Explain how transient local durability in ROS 2 QoS differs from volatile durability.',
              'When should you prefer a MultiThreadedExecutor over a StaticSingleThreadedExecutor?',
            ],
            xpReward: 600,
            estimatedHours: scaleHours(14),
          },
        },
        {
          id: 'node-ekf-sensor-fusion',
          title: 'Extended Kalman Filter (EKF) Sensor Fusion Engine',
          subtitle: 'Non-linear kinematic models, IMU, wheel ticks & GPS',
          tier: 2,
          category: 'project',
          prerequisites: ['node-linear-state-space', 'node-cpp-concurrency'],
          estimatedHours: scaleHours(18),
          position: { x: 380, y: 340 },
          quest: {
            objective: 'Fuse asynchronous 100Hz IMU and 10Hz GPS for high-accuracy localization.',
            brief: 'Develop an Extended Kalman Filter that models non-linear unicycle dynamics and fuses IMU orientation with wheel encoder velocities.',
            steps: [
              'Linearize motion dynamics using Taylor expansion to compute Jacobian F_j.',
              'Implement quaternion orientation integration to avoid gimbal lock.',
              'Validate drift suppression across simulated 5km driving loop.',
            ],
            tangibleDeliverable: 'Open-source C++ EKF library with visualization playback in Foxglove / RViz2.',
            deliverableType: 'live_demo',
            rubric: [
              { id: 'r1', name: 'Kinematic Jacobians', weight: 40, description: 'Mathematically exact Jacobians validated against numerical differentiation.', maxScore: 100 },
              { id: 'r2', name: 'Drift Mitigation', weight: 30, description: 'Position drift under 1.5% of total distance traversed.', maxScore: 100 },
              { id: 'r3', name: 'Real-Time Performance', weight: 30, description: 'Step update execution time < 0.5ms on embedded compute.', maxScore: 100 },
            ],
            curatedResources: [
              { title: 'robot_localization Package Architecture (Moore)', url: 'https://docs.ros.org/en/noetic/api/robot_localization/html/index.html', type: 'documentation' },
              { title: 'Quaternion Kinematics for Error-State KF (Sola)', url: 'https://arxiv.org/abs/1711.02508', type: 'paper' },
            ],
            interviewQuestions: [
              'Why is the Error-State Kalman Filter (ESKF) preferred over standard EKF for 3D rotations?',
              'How do you detect and reject outliers (e.g. GPS multipath jumps) in measurement updates?',
            ],
            xpReward: 750,
            estimatedHours: scaleHours(18),
          },
        },
        {
          id: 'node-lidar-slam',
          title: '3D LiDAR SLAM & Point-Cloud Odometry',
          subtitle: 'Voxel filtering, ICP/NDT registration & loop closure',
          tier: 3,
          category: 'skill',
          prerequisites: ['node-ros2-middleware', 'node-ekf-sensor-fusion'],
          estimatedHours: scaleHours(20),
          position: { x: 680, y: 200 },
          quest: {
            objective: 'Implement real-time point-cloud scan-to-map registration.',
            brief: 'Build a LiDAR odometry pipeline using downsampled Velodyne/Ouster point clouds with Generalized ICP or Normal Distributions Transform.',
            steps: [
              'Voxel grid downsampling and ground-plane removal using RANSAC.',
              'Implement Scan-to-Map registration with Ceres-Solver optimization.',
              'Integrate pose-graph optimization with g2o or GTSAM for loop closure.',
            ],
            tangibleDeliverable: 'Repository with point-cloud mapping demo and KITTI dataset benchmark evaluation.',
            deliverableType: 'benchmark_report',
            rubric: [
              { id: 'r1', name: 'Translation Accuracy', weight: 40, description: 'ATE (Absolute Trajectory Error) < 0.8m on benchmark sequence.', maxScore: 100 },
              { id: 'r2', name: 'Computation Efficiency', weight: 30, description: 'Processes 100k points in < 40ms per frame.', maxScore: 100 },
              { id: 'r3', name: 'Loop Closure Rigor', weight: 30, description: 'Eliminates accumulated drift upon returning to origin.', maxScore: 100 },
            ],
            curatedResources: [
              { title: 'LIO-SAM: Tightly-coupled Lidar Inertial Odometry (Shan et al.)', url: 'https://github.com/TixiaoShan/LIO-SAM', type: 'paper' },
              { title: 'GTSAM: Georgia Tech Smoothing and Mapping Library', url: 'https://gtsam.org/', type: 'documentation' },
            ],
            interviewQuestions: [
              'How do degenerate geometric environments (like long featureless tunnels) affect LiDAR point matching?',
              'Explain the role of keyframes and marginalization in factor graph SLAM.',
            ],
            xpReward: 850,
            estimatedHours: scaleHours(20),
          },
        },
        {
          id: 'node-mpc-planning',
          title: 'Model Predictive Control & Trajectory Optimization',
          subtitle: 'Kinodynamic constraints, QP solvers & collision avoidance',
          tier: 3,
          category: 'milestone',
          prerequisites: ['node-ekf-sensor-fusion'],
          estimatedHours: scaleHours(18),
          position: { x: 680, y: 360 },
          quest: {
            objective: 'Deploy a constrained receding-horizon controller for high-speed tracking.',
            brief: 'Formulate an MPC quadratic program (QP) with state constraints (steering angles, slip limits) to track trajectories at vehicle limits.',
            steps: [
              'Formulate bicycle kinematic model with non-holonomic constraints.',
              'Construct objective function balancing tracking error and actuator smoothness.',
              'Solve QP with OSQP / qpOASES and benchmark solve latency under 15ms.',
            ],
            tangibleDeliverable: 'Trajectory tracking simulation with simulated friction limit tests and control dashboard.',
            deliverableType: 'live_demo',
            rubric: [
              { id: 'r1', name: 'Constraint Adherence', weight: 40, description: 'Zero violation of steering rate and acceleration boundaries.', maxScore: 100 },
              { id: 'r2', name: 'Solve Time Guarantee', weight: 30, description: 'Strict deterministic termination within control loop deadline.', maxScore: 100 },
              { id: 'r3', name: 'Tracking Precision', weight: 30, description: 'Cross-track error < 5cm along high-curvature trajectories.', maxScore: 100 },
            ],
            curatedResources: [
              { title: 'Model Predictive Control for Autonomous Vehicles (Borrelli)', url: 'https://hybrid-robotics.berkeley.edu/', type: 'paper' },
              { title: 'OSQP: Operator Splitting Quadratic Program Solver', url: 'https://osqp.org/', type: 'documentation' },
            ],
            interviewQuestions: [
              'How do you ensure recursive feasibility in non-linear Model Predictive Control?',
              'What are the trade-offs between kinematic bicycle models and dynamic tire-slip models?',
            ],
            xpReward: 900,
            estimatedHours: scaleHours(18),
          },
        },
        {
          id: 'node-boss-battle-robotics',
          title: 'Titan Autonomous Vehicle Core (Capstone)',
          subtitle: 'End-to-end hardware-in-the-loop autonomous platform',
          tier: 4,
          category: 'boss_battle',
          prerequisites: ['node-lidar-slam', 'node-mpc-planning'],
          estimatedHours: scaleHours(25),
          position: { x: 960, y: 270 },
          quest: {
            objective: 'Conquer the Autonomous Vehicle Apex Capstone Trial.',
            brief: 'Synthesize the entire stack: C++ lock-free message passing, EKF state fusion, 3D LiDAR SLAM, and MPC obstacle avoidance into an integrated system.',
            steps: [
              'Deploy integrated autonomy stack in Gazebo / CARLA simulator.',
              'Execute dynamic obstacle avoidance run at 30km/h with sensor dropouts.',
              'Publish production technical report and open-source GitHub architecture repository.',
            ],
            tangibleDeliverable: 'Complete production repository with automated CI simulation runs and demonstration video.',
            deliverableType: 'live_demo',
            rubric: [
              { id: 'r1', name: 'System Integration', weight: 35, description: 'Seamless data flow across all 4 sub-systems without buffer overflow.', maxScore: 100 },
              { id: 'r2', name: 'Adversarial Robustness', weight: 35, description: 'Recovers safely from sensor packet drops and sudden roadblocks.', maxScore: 100 },
              { id: 'r3', name: 'Engineering Presentation', weight: 30, description: 'Exemplary documentation, architecture diagram, and reproducible Docker setup.', maxScore: 100 },
            ],
            curatedResources: [
              { title: 'Autoware Universe Architecture Guide', url: 'https://autowarefoundation.github.io/autoware-documentation/main/', type: 'documentation' },
              { title: 'Apollo Autonomous Driving Platform Technical Specs', url: 'https://apollo.auto/', type: 'guide' },
            ],
            interviewQuestions: [
              'Walk through the failure modes and fallback safety controller when LiDAR SLAM diverges.',
              'How would you architect a safety-critical supervisor node conforming to ISO 26262 ASIL-D?',
            ],
            xpReward: 2000,
            estimatedHours: scaleHours(25),
          },
        },
      ],
      edges: [
        { id: 'e1', source: 'node-cpp-concurrency', target: 'node-ros2-middleware', animated: true },
        { id: 'e2', source: 'node-cpp-concurrency', target: 'node-ekf-sensor-fusion', animated: true },
        { id: 'e3', source: 'node-linear-state-space', target: 'node-ekf-sensor-fusion', animated: true },
        { id: 'e4', source: 'node-ros2-middleware', target: 'node-lidar-slam', animated: true },
        { id: 'e5', source: 'node-ekf-sensor-fusion', target: 'node-lidar-slam', animated: true },
        { id: 'e6', source: 'node-ekf-sensor-fusion', target: 'node-mpc-planning', animated: true },
        { id: 'e7', source: 'node-lidar-slam', target: 'node-boss-battle-robotics', animated: true },
        { id: 'e8', source: 'node-mpc-planning', target: 'node-boss-battle-robotics', animated: true },
      ],
    };
  } else if (roleLower.includes('cyber') || roleLower.includes('security') || roleLower.includes('threat')) {
    // 2. Cyber Threat Defense & Security
    template = {
      description: `Dissects binary vulnerabilities, engineers Linux kernel telemetry, designs zero-trust cryptosystems, and implements memory-safe defensives${subTrack ? ` specializing in ${subTrack}` : ''}.`,
      bossTitle: `${ctx.targetRole}: The Adversarial Breach Citadel`,
      bossCodename: 'OP: ZERO-SHIELD-APEX',
      bossDescription: 'Multi-vector security arena requiring exploit mitigation, real-time eBPF kernel detection, and cryptographically verified network enclave defense.',
      bossPhases: [
        { id: 'p1', title: 'Phase 1: Binary Vulnerability Exploit Proof-of-Concept', deliverable: 'Weaponized ROP chain PoC with DEP/ASLR bypass analysis report', xp: 500 },
        { id: 'p2', title: 'Phase 2: Real-Time eBPF Syscall Threat Sensor', deliverable: 'Kernel eBPF probe alerting on unlinked execution and memory injection', xp: 500 },
        { id: 'p3', title: 'Phase 3: Memory-Safe Rust Isolation Enclave', deliverable: 'Hardened network parser passing libFuzzer with 10M executions', xp: 500 },
        { id: 'p4', title: 'Phase 4: Automated Threat Modeling & Zero-Trust Architecture', deliverable: 'Production threat specification and continuous verification harness', xp: 500 },
      ],
      nodes: [
        {
          id: 'node-asm-systems',
          title: 'x86_64 Assembly & Calling Conventions',
          subtitle: 'Stack frames, registers, memory layouts & GDB telemetry',
          tier: 1,
          category: 'skill',
          prerequisites: [],
          estimatedHours: scaleHours(10),
          position: { x: 80, y: 160 },
          quest: {
            objective: 'Disassemble and analyze memory corruption primitives in C binaries.',
            brief: 'Inspect stack frame layout, analyze buffer overflows using GDB/GEF, and understand canary/ASLR mitigation mechanisms.',
            steps: [
              'Write vulnerable C program with stack buffer overflow.',
              'Inspect register state (RSP, RBP, RIP) under GDB/GEF debugger.',
              'Craft input payload to hijack control flow while bypassing basic protections.',
            ],
            tangibleDeliverable: 'GDB analysis walkthrough with memory layout diagrams and exploitation notes.',
            deliverableType: 'benchmark_report',
            rubric: [
              { id: 'r1', name: 'Stack Analysis', weight: 40, description: 'Accurate dissection of stack frame alignment and canary placement.', maxScore: 100 },
              { id: 'r2', name: 'Register Tracking', weight: 30, description: 'Clean tracking of instruction pointer manipulation.', maxScore: 100 },
              { id: 'r3', name: 'Mitigation Breakdown', weight: 30, description: 'Clear explanation of NX bit, canary, and ASLR impacts.', maxScore: 100 },
            ],
            curatedResources: [
              { title: 'Computer Systems: A Programmer\'s Perspective (Bryant & O\'Hallaron)', url: 'http://csapp.cs.cmu.edu/', type: 'guide' },
              { title: 'Modern Binary Exploitation (RPISEC)', url: 'https://github.com/RPISEC/MBE', type: 'documentation' },
            ],
            interviewQuestions: [
              'How does the System V AMD64 ABI pass function arguments compared to 32-bit cdecl?',
              'Explain how Return-Oriented Programming (ROP) bypasses Non-Executable (NX) memory.',
            ],
            xpReward: 400,
            estimatedHours: scaleHours(10),
          },
        },
        {
          id: 'node-crypto-foundations',
          title: 'Applied Cryptography & Key Exchange',
          subtitle: 'Elliptic curves, authenticated encryption & timing attacks',
          tier: 1,
          category: 'assessment',
          prerequisites: [],
          estimatedHours: scaleHours(8),
          position: { x: 80, y: 340 },
          quest: {
            objective: 'Implement authenticated encryption and verify timing-attack resistance.',
            brief: 'Construct an AES-GCM / ChaCha20-Poly1305 wrapper in Python or C, demonstrating constant-time MAC verification.',
            steps: [
              'Implement non-constant time MAC comparison and demonstrate timing side-channel.',
              'Replace with constant-time comparison primitive and measure timing distribution.',
              'Write automated test verifying nonce reuse catastrophe mitigation.',
            ],
            tangibleDeliverable: 'Cryptographic test suite demonstrating constant-time validation.',
            deliverableType: 'github_repo',
            rubric: [
              { id: 'r1', name: 'Timing Side-Channel Defense', weight: 40, description: 'Zero statistical variance in comparison latency across byte mismatches.', maxScore: 100 },
              { id: 'r2', name: 'AEAD Integrity', weight: 30, description: 'Proper validation of additional authenticated data (AAD).', maxScore: 100 },
              { id: 'r3', name: 'Nonce Discipline', weight: 30, description: 'Strict enforcement preventing key/nonce collision.', maxScore: 100 },
            ],
            curatedResources: [
              { title: 'The Cryptopals Crypto Challenges', url: 'https://cryptopals.com/', type: 'guide' },
              { title: 'Real-World Cryptography (David Wong)', url: 'https://www.manning.com/books/real-world-cryptography', type: 'guide' },
            ],
            interviewQuestions: [
              'Why is nonce reuse fatal in GCM (Galois/Counter Mode)?',
              'What constitutes a side-channel attack and how do constant-time primitives prevent it?',
            ],
            xpReward: 450,
            estimatedHours: scaleHours(8),
          },
        },
        {
          id: 'node-ghidra-reversing',
          title: 'Reverse Engineering with Ghidra & Binary Decompilation',
          subtitle: 'Control flow recovery, patch diffing & anti-analysis techniques',
          tier: 2,
          category: 'skill',
          prerequisites: ['node-asm-systems'],
          estimatedHours: scaleHours(14),
          position: { x: 380, y: 160 },
          quest: {
            objective: 'Reverse-engineer an obfuscated binary to uncover undocumented protocol logic.',
            brief: 'Use NSA Ghidra to analyze a stripped compiled binary, recover structure definitions, and document command-and-control communication.',
            steps: [
              'Import stripped ELF/PE binary into Ghidra and define custom data structures.',
              'Deobfuscate string encryption routines using Ghidra Python/Java scripting.',
              'Document full control-flow graph and identify logic vulnerabilities.',
            ],
            tangibleDeliverable: 'Comprehensive reverse engineering technical report and Ghidra script.',
            deliverableType: 'benchmark_report',
            rubric: [
              { id: 'r1', name: 'Decompilation Accuracy', weight: 40, description: 'Clean recovery of struct members and function signatures.', maxScore: 100 },
              { id: 'r2', name: 'Scripting Automation', weight: 30, description: 'Automated deobfuscation script resolving encoded strings.', maxScore: 100 },
              { id: 'r3', name: 'Vulnerability Identification', weight: 30, description: 'Clear proof of identified logic flaw with reproducibility steps.', maxScore: 100 },
            ],
            curatedResources: [
              { title: 'The Ghidra Book: The Definitive Guide (Eagle & Nance)', url: 'https://nostarch.com/GhidraBook', type: 'guide' },
              { title: 'Practical Malware Analysis (Sikorski & Honig)', url: 'https://nostarch.com/malware', type: 'guide' },
            ],
            interviewQuestions: [
              'How do you identify virtual function tables (vtables) in C++ reverse engineering?',
              'What heuristics differentiate packed/compressed executables from standard binaries?',
            ],
            xpReward: 600,
            estimatedHours: scaleHours(14),
          },
        },
        {
          id: 'node-ebpf-threat-monitoring',
          title: 'Linux Kernel eBPF Telemetry & Behavioral Monitoring',
          subtitle: 'kprobes, tracepoints, aya/bcc runtimes & rootkit detection',
          tier: 2,
          category: 'project',
          prerequisites: ['node-asm-systems'],
          estimatedHours: scaleHours(18),
          position: { x: 380, y: 340 },
          quest: {
            objective: 'Build an eBPF security sensor detecting unauthorized privilege escalations.',
            brief: 'Write an eBPF probe in C/Rust hooking sys_enter_execve and security_bprm_check to track suspicious process lineage and file tampering.',
            steps: [
              'Write eBPF kernel program attached to tracepoint/syscalls.',
              'Use BPF ring buffer to stream telemetry to user-space monitoring daemon.',
              'Implement detection heuristics for reverse shells and memory injection.',
            ],
            tangibleDeliverable: 'Production eBPF telemetry sensor repository with test harness.',
            deliverableType: 'github_repo',
            rubric: [
              { id: 'r1', name: 'Verifier Compliance', weight: 40, description: 'Kernel eBPF verifier pass without unbounded loops or memory violations.', maxScore: 100 },
              { id: 'r2', name: 'Zero Overhead', weight: 30, description: 'Adds < 2 microseconds overhead to monitored syscall execution.', maxScore: 100 },
              { id: 'r3', name: 'Detection Accuracy', weight: 30, description: 'Zero false negatives on test suite of common exploit payloads.', maxScore: 100 },
            ],
            curatedResources: [
              { title: 'Learning eBPF: Developing Linux Systems Applications (Liz Rice)', url: 'https://www.oreilly.com/library/view/learning-ebpf/9781098135119/', type: 'guide' },
              { title: 'Aya: Rust-native eBPF library documentation', url: 'https://aya-rs.dev/', type: 'documentation' },
            ],
            interviewQuestions: [
              'How does the eBPF kernel verifier ensure safety and avoid panicking the operating system?',
              'Why is tracepoint-based monitoring more resilient against evasion than kprobes?',
            ],
            xpReward: 700,
            estimatedHours: scaleHours(18),
          },
        },
        {
          id: 'node-rust-memory-safe',
          title: 'Memory-Safe Systems Engineering in Rust',
          subtitle: 'Borrow checker, unsafe boundaries, FFI & fuzzing with cargo-fuzz',
          tier: 3,
          category: 'skill',
          prerequisites: ['node-ghidra-reversing', 'node-ebpf-threat-monitoring'],
          estimatedHours: scaleHours(20),
          position: { x: 680, y: 200 },
          quest: {
            objective: 'Rewrite a vulnerable C network parser in memory-safe Rust with fuzz testing.',
            brief: 'Translate a legacy network packet parser to Rust, auditing unsafe blocks and running cargo-fuzz with libFuzzer for 10M iterations.',
            steps: [
              'Port C parser to idiomatic Rust using nom or zero-copy parsing.',
              'Enforce strict panic-free behavior across malformed input boundaries.',
              'Set up continuous fuzzing pipeline with AddressSanitizer and coverage metrics.',
            ],
            tangibleDeliverable: 'Hardened Rust library with fuzzing harness and 100% test coverage.',
            deliverableType: 'github_repo',
            rubric: [
              { id: 'r1', name: 'Zero-Unsafe Core', weight: 40, description: 'No unsafe blocks in protocol parsing logic.', maxScore: 100 },
              { id: 'r2', name: 'Fuzzing Resilience', weight: 30, description: '10M inputs processed without panics or memory spikes.', maxScore: 100 },
              { id: 'r3', name: 'Throughput Parity', weight: 30, description: 'Parser throughput within 95% of unhardened C implementation.', maxScore: 100 },
            ],
            curatedResources: [
              { title: 'The Rustonomicon: The Dark Arts of Unsafe Rust', url: 'https://doc.rust-lang.org/nomicon/', type: 'documentation' },
              { title: 'Rust Fuzz Book & LibFuzzer Integration', url: 'https://rust-fuzz.github.io/book/', type: 'guide' },
            ],
            interviewQuestions: [
              'When is an unsafe block strictly necessary in high-performance network IO in Rust?',
              'Explain how Rust ownership and lifetimes eliminate Use-After-Free (UAF) vulnerabilities.',
            ],
            xpReward: 850,
            estimatedHours: scaleHours(20),
          },
        },
        {
          id: 'node-zero-trust-infra',
          title: 'Zero-Trust Architecture & SPIFFE/SPIRE Microsegmentation',
          subtitle: 'Workload identity, mutual TLS, policy engines (OPA) & mTLS',
          tier: 3,
          category: 'milestone',
          prerequisites: ['node-crypto-foundations', 'node-ebpf-threat-monitoring'],
          estimatedHours: scaleHours(18),
          position: { x: 680, y: 360 },
          quest: {
            objective: 'Implement cryptographic workload identity issuance using SPIFFE/SPIRE.',
            brief: 'Establish mutual TLS between distributed microservices using cryptographically signed X.509 SVIDs rotated every hour with Open Policy Agent authorization.',
            steps: [
              'Deploy SPIRE Server and Agent attesting workloads via Linux cgroups.',
              'Integrate SPIFFE Workload API with Envoy proxy for automated mTLS handshake.',
              'Enforce least-privilege RBAC using OPA Rego policy bundles.',
            ],
            tangibleDeliverable: 'Production zero-trust reference architecture with automated rotation verification.',
            deliverableType: 'live_demo',
            rubric: [
              { id: 'r1', name: 'Cryptographic Attestation', weight: 40, description: 'Verifiable SVID issuance tied to validated kernel workload attributes.', maxScore: 100 },
              { id: 'r2', name: 'Zero-Downtime Key Rotation', weight: 30, description: 'Sub-second key rotation without dropping active in-flight requests.', maxScore: 100 },
              { id: 'r3', name: 'Policy Enforcement', weight: 30, description: 'Strict rejection of unauthorized cross-service calls.', maxScore: 100 },
            ],
            curatedResources: [
              { title: 'SPIFFE and SPIRE: Workload Identity Specification', url: 'https://spiffe.io/', type: 'documentation' },
              { title: 'Zero Trust Networks (Gilman & Barth)', url: 'https://www.oreilly.com/library/view/zero-trust-networks/9781491962831/', type: 'guide' },
            ],
            interviewQuestions: [
              'How does SPIFFE solve the secret zero bootstrapping problem in cloud environments?',
              'Explain the difference between perimeter-based network defense and identity-based zero-trust microsegmentation.',
            ],
            xpReward: 900,
            estimatedHours: scaleHours(18),
          },
        },
        {
          id: 'node-boss-battle-cyber',
          title: 'Citadel Red/Blue Apex Trial (Capstone)',
          subtitle: 'Full-spectrum cyber offense analysis and proactive hardening',
          tier: 4,
          category: 'boss_battle',
          prerequisites: ['node-rust-memory-safe', 'node-zero-trust-infra'],
          estimatedHours: scaleHours(25),
          position: { x: 960, y: 270 },
          quest: {
            objective: 'Defeat the Citadel Security Threat Apex Trial.',
            brief: 'Integrate full-spectrum defenses: weaponized binary analysis report, custom eBPF intrusion sensor, memory-safe parser, and zero-trust policy enforcement.',
            steps: [
              'Conduct end-to-end red team breach simulation on enterprise target topology.',
              'Deploy eBPF kernel monitors and zero-trust policies to detect and mitigate all vectors.',
              'Produce audit-ready penetration testing and architectural mitigation whitepaper.',
            ],
            tangibleDeliverable: 'Comprehensive audit whitepaper and hardened security infrastructure repository.',
            deliverableType: 'github_repo',
            rubric: [
              { id: 'r1', name: 'Mitigation Rigor', weight: 35, description: 'Eliminates all identified vulnerabilities with verifiable unit/fuzz tests.', maxScore: 100 },
              { id: 'r2', name: 'Telemetry Precision', weight: 35, description: 'Real-time alert generation with sub-second detection latency.', maxScore: 100 },
              { id: 'r3', name: 'Portfolio Quality', weight: 30, description: 'Staff-engineer caliber RFC documentation with architectural threat diagrams.', maxScore: 100 },
            ],
            curatedResources: [
              { title: 'MITRE ATT&CK Enterprise Matrix Framework', url: 'https://attack.mitre.org/', type: 'documentation' },
              { title: 'Trail of Bits Engineering Guidelines', url: 'https://github.com/trailofbits/publications', type: 'guide' },
            ],
            interviewQuestions: [
              'How do you design a defensive posture capable of surviving zero-day supply chain compromises?',
              'Walk through your remediation process when an active kernel rootkit is discovered in a production cluster.',
            ],
            xpReward: 2000,
            estimatedHours: scaleHours(25),
          },
        },
      ],
      edges: [
        { id: 'e1', source: 'node-asm-systems', target: 'node-ghidra-reversing', animated: true },
        { id: 'e2', source: 'node-asm-systems', target: 'node-ebpf-threat-monitoring', animated: true },
        { id: 'e3', source: 'node-crypto-foundations', target: 'node-zero-trust-infra', animated: true },
        { id: 'e4', source: 'node-ghidra-reversing', target: 'node-rust-memory-safe', animated: true },
        { id: 'e5', source: 'node-ebpf-threat-monitoring', target: 'node-rust-memory-safe', animated: true },
        { id: 'e6', source: 'node-ebpf-threat-monitoring', target: 'node-zero-trust-infra', animated: true },
        { id: 'e7', source: 'node-rust-memory-safe', target: 'node-boss-battle-cyber', animated: true },
        { id: 'e8', source: 'node-zero-trust-infra', target: 'node-boss-battle-cyber', animated: true },
      ],
    };
  } else if (roleLower.includes('cloud') || roleLower.includes('devops') || roleLower.includes('sre') || roleLower.includes('infra')) {
    // 3. Cloud Infrastructure & Platform Engineering
    template = {
      description: `Architects planetary-scale Kubernetes systems, declarative Terraform GitOps topologies, eBPF observability, and automated disaster recovery${subTrack ? ` specializing in ${subTrack}` : ''}.`,
      bossTitle: `${ctx.targetRole}: Planetary Resiliency Nexus`,
      bossCodename: 'OP: CLOUD-TITAN-RESILIENCE',
      bossDescription: 'Global multi-region cloud cluster subjected to split-brain network partitions, multi-zone failure simulations, and automated zero-downtime recovery.',
      bossPhases: [
        { id: 'p1', title: 'Phase 1: Multi-Cluster Kubernetes Operator', deliverable: 'Custom Go CRD controller reconciling state across 3 isolated clusters', xp: 500 },
        { id: 'p2', title: 'Phase 2: Multi-Region Declarative Terraform GitOps', deliverable: 'Zero-touch infrastructure pipeline with Terratest automated validation', xp: 500 },
        { id: 'p3', title: 'Phase 3: eBPF Deep Observability & SLO Dashboard', deliverable: 'Real-time p99.9 latency telemetry with automated alerting', xp: 500 },
        { id: 'p4', title: 'Phase 4: Chaos Engineering Disaster Recovery', deliverable: 'Automated failover protocol surviving complete region outage in < 45 seconds', xp: 500 },
      ],
      nodes: [
        {
          id: 'node-linux-networking',
          title: 'Linux Networking Internals & Namespaces',
          subtitle: 'veth pairs, iptables/nftables, cgroups v2 & container runtimes',
          tier: 1,
          category: 'skill',
          prerequisites: [],
          estimatedHours: scaleHours(10),
          position: { x: 80, y: 160 },
          quest: {
            objective: 'Build a container runtime from scratch using Linux namespaces.',
            brief: 'Create a minimal container runtime in Go/C implementing PID, mount, and network namespaces with cgroups v2 memory limits.',
            steps: [
              'Isolate process using clone() with CLONE_NEWPID and CLONE_NEWNS.',
              'Set up veth pair and bridge interface for network packet forwarding.',
              'Apply cgroups v2 memory.max limit and verify OOM-killer behavior.',
            ],
            tangibleDeliverable: 'GitHub repository with DIY container runtime and test scripts.',
            deliverableType: 'github_repo',
            rubric: [
              { id: 'r1', name: 'Namespace Isolation', weight: 40, description: 'Complete filesystem, network, and PID isolation verified.', maxScore: 100 },
              { id: 'r2', name: 'cgroups v2 Enforcement', weight: 30, description: 'Memory ceiling strictly enforced by operating system.', maxScore: 100 },
              { id: 'r3', name: 'Network Connectivity', weight: 30, description: 'Bi-directional ping and HTTP routing between host and namespace.', maxScore: 100 },
            ],
            curatedResources: [
              { title: 'Linux Namespaces man page (namespaces(7))', url: 'https://man7.org/linux/man-pages/man7/namespaces.7.html', type: 'documentation' },
              { title: 'Build Your Own Container in Go (Liz Rice)', url: 'https://github.com/lizrice/containers-from-scratch', type: 'guide' },
            ],
            interviewQuestions: [
              'What is the difference between cgroups v1 and cgroups v2 unified hierarchy?',
              'How does container network interface (CNI) utilize iptables/eBPF for packet routing?',
            ],
            xpReward: 400,
            estimatedHours: scaleHours(10),
          },
        },
        {
          id: 'node-gitops-cicd',
          title: 'Declarative GitOps & Immutable Infrastructure',
          subtitle: 'ArgoCD, GitHub Actions, semantic versioning & artifact signing',
          tier: 1,
          category: 'assessment',
          prerequisites: [],
          estimatedHours: scaleHours(8),
          position: { x: 80, y: 340 },
          quest: {
            objective: 'Implement end-to-end GitOps deployment with Cosign artifact signing.',
            brief: 'Set up an automated CI/CD pipeline using GitHub Actions that builds container images, signs them with Cosign keyless signatures, and synchronizes via ArgoCD.',
            steps: [
              'Configure GitHub Actions matrix build with multi-arch Docker buildx.',
              'Sign container image digest using Sigstore Cosign with OIDC.',
              'Configure ArgoCD Application with automated drift detection and self-healing.',
            ],
            tangibleDeliverable: 'Live repository with automated GitOps pipeline and verified attestations.',
            deliverableType: 'live_demo',
            rubric: [
              { id: 'r1', name: 'Security Attestation', weight: 40, description: 'Image signature verified by admission controller before deployment.', maxScore: 100 },
              { id: 'r2', name: 'GitOps Reconciliation', weight: 30, description: 'ArgoCD automatically detects manual drift and reconciles in < 30s.', maxScore: 100 },
              { id: 'r3', name: 'Pipeline Efficiency', weight: 30, description: 'Build and verification stage executes in under 3 minutes with cache.', maxScore: 100 },
            ],
            curatedResources: [
              { title: 'ArgoCD Official Architecture Guide', url: 'https://argo-cd.readthedocs.io/en/stable/', type: 'documentation' },
              { title: 'Sigstore Cosign Documentation', url: 'https://docs.sigstore.dev/cosign/overview/', type: 'guide' },
            ],
            interviewQuestions: [
              'Explain the push vs pull model in modern continuous deployment.',
              'How does cryptographic image signing prevent software supply chain attacks?',
            ],
            xpReward: 450,
            estimatedHours: scaleHours(8),
          },
        },
        {
          id: 'node-k8s-operator',
          title: 'Custom Kubernetes Operators in Go',
          subtitle: 'controller-runtime, CustomResourceDefinitions, status subresources & reconciliation loops',
          tier: 2,
          category: 'project',
          prerequisites: ['node-linux-networking'],
          estimatedHours: scaleHours(16),
          position: { x: 380, y: 160 },
          quest: {
            objective: 'Build a production Kubernetes Operator managing stateful database clusters.',
            brief: 'Develop an Operator using Kubebuilder / Operator SDK in Go that provisions PostgreSQL replicas, monitors health, and performs automated failover.',
            steps: [
              'Define CRD schema with OpenAPI v3 validation markers.',
              'Implement idempotent Reconcile() loop with event filtering and predicate logic.',
              'Write unit and integration tests using envtest with simulated cluster API.',
            ],
            tangibleDeliverable: 'Open-source Go Kubernetes Operator repository with Helm chart and test suite.',
            deliverableType: 'github_repo',
            rubric: [
              { id: 'r1', name: 'Reconciliation Idempotency', weight: 40, description: 'Reconcile loop is strictly idempotent under duplicate event fires.', maxScore: 100 },
              { id: 'r2', name: 'Status Subresource', weight: 30, description: 'Accurate condition reporting with standard Metav1 Conditions.', maxScore: 100 },
              { id: 'r3', name: 'Automated Testing', weight: 30, description: '100% envtest pass verifying scaling and self-healing.', maxScore: 100 },
            ],
            curatedResources: [
              { title: 'The Kubebuilder Book', url: 'https://book.kubebuilder.io/', type: 'guide' },
              { title: 'Programming Kubernetes (Hausenblas & Schimanski)', url: 'https://www.oreilly.com/library/view/programming-kubernetes/9781492047094/', type: 'guide' },
            ],
            interviewQuestions: [
              'Why must the Kubernetes controller Reconcile() loop be level-triggered rather than edge-triggered?',
              'How do finalizers in Kubernetes prevent premature resource deletion?',
            ],
            xpReward: 650,
            estimatedHours: scaleHours(16),
          },
        },
        {
          id: 'node-terraform-iac',
          title: 'Multi-Region Terraform Architecture & Terratest',
          subtitle: 'Modular IaC, state locking, remote backends & automated compliance testing',
          tier: 2,
          category: 'skill',
          prerequisites: ['node-gitops-cicd'],
          estimatedHours: scaleHours(16),
          position: { x: 380, y: 340 },
          quest: {
            objective: 'Architect reusable multi-cloud Terraform modules with automated validation.',
            brief: 'Build modular Terraform code deploying high-availability VPCs, managed Kubernetes clusters, and global load balancers with automated Go integration tests using Terratest.',
            steps: [
              'Write composable Terraform modules with strict input validation and documentation.',
              'Set up remote S3/GCS state storage with DynamoDB state locking.',
              'Write end-to-end Terratest suites spinning up temporary test environments.',
            ],
            tangibleDeliverable: 'Production Terraform infrastructure repository with Terratest automated CI suite.',
            deliverableType: 'github_repo',
            rubric: [
              { id: 'r1', name: 'Module Reusability', weight: 40, description: 'Zero hardcoded identifiers; parameterized variables with defaults.', maxScore: 100 },
              { id: 'r2', name: 'Automated Terratest', weight: 30, description: 'Automated spin-up, assertion verification, and clean teardown.', maxScore: 100 },
              { id: 'r3', name: 'Security & Compliance', weight: 30, description: 'Passes tfsec / trivy scan with zero high or critical findings.', maxScore: 100 },
            ],
            curatedResources: [
              { title: 'Terraform Up & Running (Yevgeniy Brikman)', url: 'https://www.terraformupandrunning.com/', type: 'guide' },
              { title: 'Terratest Documentation by Gruntwork', url: 'https://terratest.gruntwork.io/', type: 'documentation' },
            ],
            interviewQuestions: [
              'How do you manage breaking changes in shared Terraform modules across multiple product teams?',
              'What strategies prevent split-brain states when Terraform remote locking fails?',
            ],
            xpReward: 650,
            estimatedHours: scaleHours(16),
          },
        },
        {
          id: 'node-ebpf-observability',
          title: 'eBPF-Based Telemetry & Distributed SRE Observability',
          subtitle: 'Prometheus, OpenTelemetry, Grafana dashboards & p99 latency SLOs',
          tier: 3,
          category: 'skill',
          prerequisites: ['node-k8s-operator', 'node-terraform-iac'],
          estimatedHours: scaleHours(20),
          position: { x: 680, y: 200 },
          quest: {
            objective: 'Build an observability mesh tracking golden signals across microservices.',
            brief: 'Instrument distributed workloads using OpenTelemetry collectors and eBPF network telemetry, calculating multi-window multi-burn-rate error budget alerts.',
            steps: [
              'Deploy OpenTelemetry Collector pipeline exporting traces and metrics to Prometheus and Tempo.',
              'Implement eBPF HTTP/gRPC auto-instrumentation capturing TCP latency and drops.',
              'Formulate PromQL alerting rules based on Google SRE multi-burn-rate framework.',
            ],
            tangibleDeliverable: 'Grafana dashboard snapshot and PromQL alerting repository with synthetic load generator.',
            deliverableType: 'live_demo',
            rubric: [
              { id: 'r1', name: 'SLO Fidelity', weight: 40, description: 'Multi-window multi-burn-rate alerts accurately flagging budget depletion.', maxScore: 100 },
              { id: 'r2', name: 'Distributed Trace Context', weight: 30, description: 'End-to-end W3C traceparent propagation across all microservice hops.', maxScore: 100 },
              { id: 'r3', name: 'Telemetry Overhead', weight: 30, description: 'CPU utilization of monitoring sidecars < 2% of total node compute.', maxScore: 100 },
            ],
            curatedResources: [
              { title: 'Google Site Reliability Engineering Handbook (Beyer et al.)', url: 'https://sre.google/sre-book/table-of-contents/', type: 'guide' },
              { title: 'OpenTelemetry Specification and Architecture', url: 'https://opentelemetry.io/docs/specs/otel/', type: 'documentation' },
            ],
            interviewQuestions: [
              'Why are multi-window multi-burn-rate alerts superior to single-window threshold alerts?',
              'Explain how OpenTelemetry collector handles tail-based trace sampling in high-throughput clusters.',
            ],
            xpReward: 850,
            estimatedHours: scaleHours(20),
          },
        },
        {
          id: 'node-chaos-disaster-recovery',
          title: 'Chaos Engineering & Automated Disaster Recovery',
          subtitle: 'Chaos Mesh, network partitions, split-brain mitigation & RTO/RPO validation',
          tier: 3,
          category: 'milestone',
          prerequisites: ['node-k8s-operator', 'node-terraform-iac'],
          estimatedHours: scaleHours(18),
          position: { x: 680, y: 360 },
          quest: {
            objective: 'Validate automated region failover under simulated chaos injections.',
            brief: 'Inject network partitions, node terminates, and DNS blackholes using Chaos Mesh, demonstrating automated failover with Recovery Time Objective (RTO) < 60s.',
            steps: [
              'Design chaos experiment simulating complete loss of primary database leader.',
              'Measure error rate and traffic rerouting speed via Route53 / Cloudflare DNS health checks.',
              'Publish automated post-mortem detailing system resilience and blast radius containment.',
            ],
            tangibleDeliverable: 'Chaos engineering testing suite with disaster recovery benchmark report.',
            deliverableType: 'benchmark_report',
            rubric: [
              { id: 'r1', name: 'RTO / RPO Compliance', weight: 40, description: 'RTO < 60s and zero permanent data loss (RPO = 0) verified.', maxScore: 100 },
              { id: 'r2', name: 'Blast Radius Containment', weight: 30, description: 'Unaffected service tiers maintain 99.99% availability during fault.', maxScore: 100 },
              { id: 'r3', name: 'Post-Mortem Rigor', weight: 30, description: 'Blameless post-mortem with actionable preventive architecture changes.', maxScore: 100 },
            ],
            curatedResources: [
              { title: 'Chaos Engineering: System Resiliency in Practice (Rosenthal & Jones)', url: 'https://www.oreilly.com/library/view/chaos-engineering/9781492043850/', type: 'guide' },
              { title: 'Chaos Mesh: A Cloud-Native Chaos Engineering Platform', url: 'https://chaos-mesh.org/', type: 'documentation' },
            ],
            interviewQuestions: [
              'How do you prevent cascade failures when reintroducing a recovered cluster into production rotation?',
              'What mechanisms guarantee data consistency during an emergency failover across asynchronous replicas?',
            ],
            xpReward: 900,
            estimatedHours: scaleHours(18),
          },
        },
        {
          id: 'node-boss-battle-cloud',
          title: 'Planetary Infrastructure Core (Capstone)',
          subtitle: 'Autonomous global cloud platform surviving multi-region chaos',
          tier: 4,
          category: 'boss_battle',
          prerequisites: ['node-ebpf-observability', 'node-chaos-disaster-recovery'],
          estimatedHours: scaleHours(25),
          position: { x: 960, y: 270 },
          quest: {
            objective: 'Conquer the Cloud Platform Apex Capstone Trial.',
            brief: 'Synthesize the entire infrastructure platform: custom Kubernetes operators, multi-region Terraform GitOps, eBPF telemetry mesh, and automated disaster recovery under live chaos.',
            steps: [
              'Deploy complete planetary platform spanning 3 distinct cloud regions.',
              'Subject cluster to simulated catastrophic multi-datacenter outage.',
              'Verify automated healing, zero human intervention, and publish production architecture RFC.',
            ],
            tangibleDeliverable: 'Production multi-cloud architecture repository, live demo dashboard, and engineering whitepaper.',
            deliverableType: 'live_demo',
            rubric: [
              { id: 'r1', name: 'Resilience Under Fire', weight: 35, description: 'Sustains 100,000 req/sec through deliberate zone shutdowns without dropped sessions.', maxScore: 100 },
              { id: 'r2', name: 'Operational Excellence', weight: 35, description: 'Zero manual commands required to recover cluster to full health.', maxScore: 100 },
              { id: 'r3', name: 'Infrastructure Documentation', weight: 30, description: 'Executive and technical RFC documentation with architecture diagrams.', maxScore: 100 },
            ],
            curatedResources: [
              { title: 'The Site Reliability Workbook (Google SRE Team)', url: 'https://sre.google/workbook/table-of-contents/', type: 'guide' },
              { title: 'AWS Well-Architected Framework: Reliability Pillar', url: 'https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html', type: 'documentation' },
            ],
            interviewQuestions: [
              'How do you balance cost vs redundancy when architecting multi-region active-active clusters?',
              'Explain how eBPF bypasses iptables overhead in modern cloud Kubernetes networking.',
            ],
            xpReward: 2000,
            estimatedHours: scaleHours(25),
          },
        },
      ],
      edges: [
        { id: 'e1', source: 'node-linux-networking', target: 'node-k8s-operator', animated: true },
        { id: 'e2', source: 'node-gitops-cicd', target: 'node-terraform-iac', animated: true },
        { id: 'e3', source: 'node-linux-networking', target: 'node-terraform-iac', animated: true },
        { id: 'e4', source: 'node-k8s-operator', target: 'node-ebpf-observability', animated: true },
        { id: 'e5', source: 'node-k8s-operator', target: 'node-chaos-disaster-recovery', animated: true },
        { id: 'e6', source: 'node-terraform-iac', target: 'node-ebpf-observability', animated: true },
        { id: 'e7', source: 'node-ebpf-observability', target: 'node-boss-battle-cloud', animated: true },
        { id: 'e8', source: 'node-chaos-disaster-recovery', target: 'node-boss-battle-cloud', animated: true },
      ],
    };
  } else if (roleLower.includes('web') || roleLower.includes('full-stack') || roleLower.includes('frontend')) {
    // 4. Full-Stack Web Architect
    template = {
      description: `Architects high-performance interactive applications, WebAssembly runtimes, collaborative CRDT canvases, and edge serverless topologies${subTrack ? ` specializing in ${subTrack}` : ''}.`,
      bossTitle: `${ctx.targetRole}: Omniverse Platform Nexus`,
      bossCodename: 'OP: CANVAS-SYNC-APEX',
      bossDescription: 'Collaborative real-time application handling 1,000 concurrent editing streams with WebAssembly rendering, CRDT state sync, and edge deployment.',
      bossPhases: [
        { id: 'p1', title: 'Phase 1: Zero-Latency Canvas Rendering Engine', deliverable: 'WebGL / WebAssembly canvas rendering 50,000 entities at solid 60fps', xp: 500 },
        { id: 'p2', title: 'Phase 2: Conflict-Free Replicated Data Type (CRDT) Sync', deliverable: 'State sync engine resolving distributed edits without centralized locks', xp: 500 },
        { id: 'p3', title: 'Phase 3: Edge Streaming SSR & Micro-Frontends', deliverable: 'Sub-30ms TTFT distributed edge API gateway deployment', xp: 500 },
        { id: 'p4', title: 'Phase 4: High-Concurrency Stress Test & Audit', deliverable: 'Chaos test report with 1,000 concurrent bot editors without drift', xp: 500 },
      ],
      nodes: [
        {
          id: 'node-ts-type-systems',
          title: 'Advanced TypeScript Type Systems & Compilers',
          subtitle: 'Conditional types, template literals, AST transforms & runtime validators',
          tier: 1,
          category: 'skill',
          prerequisites: [],
          estimatedHours: scaleHours(10),
          position: { x: 80, y: 160 },
          quest: {
            objective: 'Build a type-safe schema validator and RPC framework in TypeScript.',
            brief: 'Implement a zero-dependency schema validation and type inference library matching Zod/TypeBox capabilities using conditional types.',
            steps: [
              'Design recursive type inference primitives extracting TypeScript types from schemas.',
              'Implement validation engine with detailed error path reporting.',
              'Benchmark performance against standard JSON schema validators.',
            ],
            tangibleDeliverable: 'npm-publishable TypeScript library repository with comprehensive test suite.',
            deliverableType: 'github_repo',
            rubric: [
              { id: 'r1', name: 'Type Inference Precision', weight: 40, description: 'Zero `any` leaks; exact static types derived automatically.', maxScore: 100 },
              { id: 'r2', name: 'Validation Performance', weight: 30, description: 'Parses 50k payloads/sec without garbage collection spikes.', maxScore: 100 },
              { id: 'r3', name: 'Error Diagnostics', weight: 30, description: 'Pinpoint error paths (e.g. users[2].email) with human-readable hints.', maxScore: 100 },
            ],
            curatedResources: [
              { title: 'TypeScript Compiler API & Type Gymnastics', url: 'https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API', type: 'documentation' },
              { title: 'Tackling TypeScript (Dr. Axel Rauschmayer)', url: 'https://exploringjs.com/tackling-ts/', type: 'guide' },
            ],
            interviewQuestions: [
              'How do distributive conditional types work when evaluated over union types?',
              'Explain the difference between covariance and contravariance in TypeScript function arguments.',
            ],
            xpReward: 400,
            estimatedHours: scaleHours(10),
          },
        },
        {
          id: 'node-websockets-binary',
          title: 'Real-Time WebSockets & Binary Protocols',
          subtitle: 'ArrayBuffers, flatbuffers, protobuf over WS & backpressure',
          tier: 1,
          category: 'assessment',
          prerequisites: [],
          estimatedHours: scaleHours(8),
          position: { x: 80, y: 340 },
          quest: {
            objective: 'Implement a binary delta protocol over WebSockets with backpressure.',
            brief: 'Create a high-frequency telemetry server and client streaming binary frames using ArrayBuffer and TypedArrays with client backpressure flow control.',
            steps: [
              'Design binary message header layout using DataView and Uint8Array.',
              'Implement client-side buffer draining and backpressure signaling.',
              'Benchmark bandwidth reduction vs standard JSON WebSockets.',
            ],
            tangibleDeliverable: 'Interactive benchmarking prototype comparing JSON vs binary transfer overhead.',
            deliverableType: 'benchmark_report',
            rubric: [
              { id: 'r1', name: 'Bandwidth Reduction', weight: 40, description: 'Achieves > 65% byte-size reduction compared to JSON payload.', maxScore: 100 },
              { id: 'r2', name: 'Backpressure Handling', weight: 30, description: 'Gracefully throttles when client connection degrades without crashing server.', maxScore: 100 },
              { id: 'r3', name: 'Zero Memory Leak', weight: 30, description: 'Profiled under Chrome DevTools Memory tab with flat heap allocation.', maxScore: 100 },
            ],
            curatedResources: [
              { title: 'MDN WebSockets API & ArrayBuffer Reference', url: 'https://developer.mozilla.org/en-US/docs/Web/API/WebSocket', type: 'documentation' },
              { title: 'High Performance Browser Networking (Ilya Grigorik)', url: 'https://hpbn.co/', type: 'guide' },
            ],
            interviewQuestions: [
              'How does WebSocket framing handle masking keys from client to server?',
              'Why is binary protocol packing preferable to JSON in multi-user collaborative editors?',
            ],
            xpReward: 450,
            estimatedHours: scaleHours(8),
          },
        },
        {
          id: 'node-crdt-sync',
          title: 'Collaborative Real-Time State & CRDT Engines',
          subtitle: 'Yjs, Automerge, state vectors, conflict resolution & offline sync',
          tier: 2,
          category: 'project',
          prerequisites: ['node-ts-type-systems', 'node-websockets-binary'],
          estimatedHours: scaleHours(18),
          position: { x: 380, y: 160 },
          quest: {
            objective: 'Build a collaborative document editor with offline synchronization.',
            brief: 'Construct a multi-client collaborative document engine using Yjs or Automerge supporting offline edits, reconnection reconciliation, and awareness cursor tracks.',
            steps: [
              'Integrate Yjs shared types (Y.Text, Y.Map) with WebSocket sync provider.',
              'Simulate network disconnection, apply concurrent conflicting edits, and verify convergence.',
              'Implement presence and cursor tracking with smooth interpolation.',
            ],
            tangibleDeliverable: 'Live multi-tab collaborative editor demo with conflict verification tests.',
            deliverableType: 'live_demo',
            rubric: [
              { id: 'r1', name: 'Convergence Guarantee', weight: 40, description: '100% deterministic state convergence across all clients after reconnect.', maxScore: 100 },
              { id: 'r2', name: 'Offline Edit Durability', weight: 30, description: 'Offline changes persist in IndexedDB and synchronize cleanly upon reconnection.', maxScore: 100 },
              { id: 'r3', name: 'Presence Latency', weight: 30, description: 'Cursor positions update with < 25ms round-trip latency.', maxScore: 100 },
            ],
            curatedResources: [
              { title: 'Yjs: Shared Data Types for Building Collaborative Software', url: 'https://yjs.dev/', type: 'documentation' },
              { title: 'Conflict-free Replicated Data Types (Shapiro et al.)', url: 'https://hal.inria.fr/inria-00555588/', type: 'paper' },
            ],
            interviewQuestions: [
              'How does a state vector in CRDTs differ from a full document snapshot?',
              'What are the advantages and drawbacks of state-based vs operation-based CRDTs?',
            ],
            xpReward: 700,
            estimatedHours: scaleHours(18),
          },
        },
        {
          id: 'node-canvas-webgl',
          title: 'High-Performance Canvas, WebAssembly & WebGL Rendering',
          subtitle: 'Spatial hashing, dirty rectangles, WASM Rust core & 60fps physics',
          tier: 2,
          category: 'skill',
          prerequisites: ['node-ts-type-systems'],
          estimatedHours: scaleHours(16),
          position: { x: 380, y: 340 },
          quest: {
            objective: 'Render 20,000 animated nodes at 60fps on HTML5 Canvas using WebAssembly.',
            brief: 'Write an accelerated spatial indexing and physics engine in Rust compiled to WebAssembly, rendered onto an HTML5 Canvas using OffscreenCanvas and Web Workers.',
            steps: [
              'Write spatial hash grid in Rust with wasm-bindgen for fast neighbor lookups.',
              'Transfer canvas rendering control to Web Worker using OffscreenCanvas.',
              'Benchmark frame times and eliminate main thread jank under high entity count.',
            ],
            tangibleDeliverable: 'Interactive live demo with FPS monitor and entity stress tester.',
            deliverableType: 'live_demo',
            rubric: [
              { id: 'r1', name: 'Solid 60 FPS', weight: 40, description: 'Maintains 60fps with 20,000 active nodes without dropping frames.', maxScore: 100 },
              { id: 'r2', name: 'Main Thread Offload', weight: 30, description: 'Main thread frame time stays under 2ms during simulation.', maxScore: 100 },
              { id: 'r3', name: 'Zero Memory Leaks', weight: 30, description: 'WASM linear memory allocations stay bounded and stable.', maxScore: 100 },
            ],
            curatedResources: [
              { title: 'Rust and WebAssembly Official Book', url: 'https://rustwasm.github.io/docs/book/', type: 'documentation' },
              { title: 'HTML5 Canvas Deep Dive & Optimization (Smashing Magazine)', url: 'https://www.smashingmagazine.com/2012/12/optimizing-html5-canvas/', type: 'guide' },
            ],
            interviewQuestions: [
              'Why is OffscreenCanvas in a Web Worker superior for heavy graphics rendering?',
              'How do you avoid serialization overhead when passing data across the JS-WASM boundary?',
            ],
            xpReward: 700,
            estimatedHours: scaleHours(16),
          },
        },
        {
          id: 'node-edge-serverless',
          title: 'Edge Serverless Architecture & Distributed Streaming',
          subtitle: 'Cloudflare Workers, streaming SSR, V8 isolates & global caching',
          tier: 3,
          category: 'skill',
          prerequisites: ['node-crdt-sync', 'node-canvas-webgl'],
          estimatedHours: scaleHours(20),
          position: { x: 680, y: 200 },
          quest: {
            objective: 'Deploy a global streaming API gateway on V8 Edge Isolates.',
            brief: 'Implement an edge router handling auth verification, rate limiting with Token Bucket algorithm, and streaming responses with TTFT < 30ms globally.',
            steps: [
              'Deploy edge service using Cloudflare Workers / Fastly Compute.',
              'Implement distributed rate limiting using Redis / KV edge storage.',
              'Stream LLM / real-time chunks using ReadableStream with zero buffering.',
            ],
            tangibleDeliverable: 'Global edge service repository with benchmark latency report across 10 worldwide regions.',
            deliverableType: 'benchmark_report',
            rubric: [
              { id: 'r1', name: 'Global TTFT', weight: 40, description: 'Time To First Token / Byte < 30ms across 80% of test regions.', maxScore: 100 },
              { id: 'r2', name: 'Rate Limiting Accuracy', weight: 30, description: 'Accurate distributed token bucket enforcement without race conditions.', maxScore: 100 },
              { id: 'r3', name: 'Cold Start Elimination', weight: 30, description: 'Zero cold start latency due to V8 isolate instant execution.', maxScore: 100 },
            ],
            curatedResources: [
              { title: 'Cloudflare Workers Runtime Documentation', url: 'https://developers.cloudflare.com/workers/', type: 'documentation' },
              { title: 'Web Streams API Specification', url: 'https://streams.spec.whatwg.org/', type: 'guide' },
            ],
            interviewQuestions: [
              'How do V8 isolate runtimes achieve sub-millisecond cold starts compared to containerized serverless?',
              'Explain how streaming SSR improves Core Web Vitals (INP and LCP).',
            ],
            xpReward: 850,
            estimatedHours: scaleHours(20),
          },
        },
        {
          id: 'node-web-auditing-security',
          title: 'Core Web Vitals & Enterprise Web Security',
          subtitle: 'CSP Level 3, subresource integrity, performance budgeting & synthetic testing',
          tier: 3,
          category: 'milestone',
          prerequisites: ['node-edge-serverless'],
          estimatedHours: scaleHours(16),
          position: { x: 680, y: 360 },
          quest: {
            objective: 'Achieve 100/100 Lighthouse performance and A+ security headers.',
            brief: 'Audit and harden a production web app: configure Content Security Policy (CSP), eliminate render-blocking resources, and set up automated Lighthouse CI.',
            steps: [
              'Implement strict CSP with nonces preventing inline XSS execution.',
              'Optimize critical CSS rendering and image WebP/AVIF compression.',
              'Enforce automated Lighthouse CI gate in pull requests (minimum score 98).',
            ],
            tangibleDeliverable: 'Lighthouse CI report, security header score card, and performance optimization PR.',
            deliverableType: 'benchmark_report',
            rubric: [
              { id: 'r1', name: 'Lighthouse Score', weight: 40, description: 'Lighthouse 98+ across Performance, Accessibility, and Best Practices.', maxScore: 100 },
              { id: 'r2', name: 'Security Grade', weight: 30, description: 'A+ score on Mozilla Observatory and securityheaders.com.', maxScore: 100 },
              { id: 'r3', name: 'INP Optimization', weight: 30, description: 'Interaction to Next Paint (INP) < 50ms verified on real user devices.', maxScore: 100 },
            ],
            curatedResources: [
              { title: 'web.dev Core Web Vitals Guidance (Google Chrome Team)', url: 'https://web.dev/vitals/', type: 'documentation' },
              { title: 'Content Security Policy Level 3 W3C Recommendation', url: 'https://www.w3.org/TR/CSP3/', type: 'guide' },
            ],
            interviewQuestions: [
              'What browser metrics replaced First Input Delay (FID) with Interaction to Next Paint (INP)?',
              'How does a nonce-based Content Security Policy protect single-page applications against XSS?',
            ],
            xpReward: 900,
            estimatedHours: scaleHours(16),
          },
        },
        {
          id: 'node-boss-battle-web',
          title: 'Omniverse Web Architecture (Capstone)',
          subtitle: 'High-scale collaborative graphics platform deployed globally',
          tier: 4,
          category: 'boss_battle',
          prerequisites: ['node-edge-serverless', 'node-web-auditing-security'],
          estimatedHours: scaleHours(25),
          position: { x: 960, y: 270 },
          quest: {
            objective: 'Conquer the Full-Stack Web Platform Capstone Trial.',
            brief: 'Deliver an integrated world-class platform: high-performance WASM canvas, real-time CRDT sync, edge serverless API, and 100/100 Lighthouse performance.',
            steps: [
              'Deploy full platform on public production URL.',
              'Run automated load test simulating 500 concurrent collaborative editing sessions.',
              'Publish production repository with comprehensive architecture documentation and tests.',
            ],
            tangibleDeliverable: 'Live production URL, complete GitHub repository, and technical architecture RFC.',
            deliverableType: 'live_demo',
            rubric: [
              { id: 'r1', name: 'Live Usability & Polish', weight: 35, description: 'Silky smooth 60fps interaction with instant collaborative sync.', maxScore: 100 },
              { id: 'r2', name: 'Code Architecture', weight: 35, description: 'Modular Clean Architecture with 100% TypeScript type safety.', maxScore: 100 },
              { id: 'r3', name: 'Technical Depth', weight: 30, description: 'Clear demonstration of WebAssembly, CRDTs, and edge streaming.', maxScore: 100 },
            ],
            curatedResources: [
              { title: 'Figma Engineering Blog: How Figma\'s Multiplayer Works', url: 'https://www.figma.com/blog/how-figmas-multiplayer-technology-works/', type: 'guide' },
              { title: 'Linear Method: Design and Engineering Principles', url: 'https://linear.app/method', type: 'guide' },
            ],
            interviewQuestions: [
              'Walk through how you would architect a collaborative design canvas like Figma from scratch.',
              'How do you manage client-side state caching when the user has spotty cellular connectivity?',
            ],
            xpReward: 2000,
            estimatedHours: scaleHours(25),
          },
        },
      ],
      edges: [
        { id: 'e1', source: 'node-ts-type-systems', target: 'node-crdt-sync', animated: true },
        { id: 'e2', source: 'node-websockets-binary', target: 'node-crdt-sync', animated: true },
        { id: 'e3', source: 'node-ts-type-systems', target: 'node-canvas-webgl', animated: true },
        { id: 'e4', source: 'node-crdt-sync', target: 'node-edge-serverless', animated: true },
        { id: 'e5', source: 'node-canvas-webgl', target: 'node-edge-serverless', animated: true },
        { id: 'e6', source: 'node-edge-serverless', target: 'node-web-auditing-security', animated: true },
        { id: 'e7', source: 'node-edge-serverless', target: 'node-boss-battle-web', animated: true },
        { id: 'e8', source: 'node-web-auditing-security', target: 'node-boss-battle-web', animated: true },
      ],
    };
  } else {
    // 5. Default / AI Research & Foundation Models / General Tech
    template = {
      description: `Designs, benchmarks, and implements deep learning architectures, transformer models, and scalable neural pipelines${subTrack ? ` specializing in ${subTrack}` : ''}.`,
      bossTitle: `${ctx.targetRole}: Titan Neural Nexus Core`,
      bossCodename: 'OP: SYNAPSE-TITAN-APEX',
      bossDescription: 'A multi-phase trial synthesizing data curation, distributed LoRA fine-tuning, automated evaluation rigor, and low-latency quantization serving.',
      bossPhases: [
        { id: 'p1', title: 'Phase 1: Data Synthesis & Quality Rejection Sampling', deliverable: 'Clean synthetic reasoning corpus with quality filtering', xp: 500 },
        { id: 'p2', title: 'Phase 2: Distributed LoRA / DoRA Training', deliverable: 'Training runs with loss convergence curves', xp: 500 },
        { id: 'p3', title: 'Phase 3: Adversarial Benchmarking Suite', deliverable: 'Statistical pass@k evaluation dashboard', xp: 500 },
        { id: 'p4', title: 'Phase 4: High-Throughput vLLM Quantized Deployment', deliverable: 'Production API endpoint with <25ms TTFT', xp: 500 },
      ],
      nodes: [
        {
          id: 'node-py-perf',
          title: 'Python High-Performance Profiling',
          subtitle: 'Vectorization, memory profiling & C-extensions',
          tier: 1,
          category: 'skill',
          prerequisites: [],
          estimatedHours: scaleHours(8),
          position: { x: 80, y: 160 },
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
              { id: 'r1', name: 'Measurable Speedup', weight: 40, description: 'Achieves at least 8x latency reduction on test suite.', maxScore: 100 },
              { id: 'r2', name: 'Memory Efficiency', weight: 30, description: 'Zero memory leaks, peak memory reduced by > 50%.', maxScore: 100 },
              { id: 'r3', name: 'Code Maintainability', weight: 30, description: 'Clean typing annotations, docstrings, and parameterized tests.', maxScore: 100 },
            ],
            curatedResources: [
              { title: 'High Performance Python (Gorelick & Ozsvald)', url: 'https://www.oreilly.com/library/view/high-performance-python/9781492055013/', type: 'guide' },
              { title: 'NumPy Vectorization & Strides Guide', url: 'https://numpy.org/doc/stable/reference/arrays.ndarray.html', type: 'documentation' },
            ],
            interviewQuestions: [
              'Explain how the Python GIL affects CPU-bound vs IO-bound multi-threading.',
              'How do memory views and strides avoid copying large NumPy arrays?',
            ],
            xpReward: 350,
            estimatedHours: scaleHours(8),
          },
        },
        {
          id: 'node-linalg-tensors',
          title: 'Reverse-Mode Autodiff Engine',
          subtitle: 'Vector calculus, Jacobian chains & computational DAGs',
          tier: 1,
          category: 'assessment',
          prerequisites: [],
          estimatedHours: scaleHours(12),
          position: { x: 80, y: 340 },
          quest: {
            objective: 'Build a scalar & tensor automatic differentiation engine from scratch.',
            brief: 'Implement reverse-mode automatic differentiation supporting topological sort backpropagation, broadcasted tensor operations, and verification against PyTorch autograd.',
            steps: [
              'Implement Value node with forward op and backward gradient closure.',
              'Build topological sorting traversal to compute exact gradients.',
              'Run gradient check (gradcheck) verifying numerical vs analytical gradient equivalence.',
            ],
            tangibleDeliverable: 'Self-contained Python autodiff package with full test suite passing gradcheck.',
            deliverableType: 'github_repo',
            rubric: [
              { id: 'r1', name: 'Gradcheck Verification', weight: 40, description: 'Numerical vs analytical gradient difference < 1e-6 across all operations.', maxScore: 100 },
              { id: 'r2', name: 'DAG Traversal Correctness', weight: 30, description: 'Flawless topological sort without duplicate gradient accumulation bugs.', maxScore: 100 },
              { id: 'r3', name: 'Broadcast Tensor Ops', weight: 30, description: 'Handles matrix multiplication, broadcast addition, and reduction sums.', maxScore: 100 },
            ],
            curatedResources: [
              { title: 'micrograd (Andrej Karpathy)', url: 'https://github.com/karpathy/micrograd', type: 'guide' },
              { title: 'Automatic Differentiation in Machine Learning: A Survey', url: 'https://arxiv.org/abs/1502.05767', type: 'paper' },
            ],
            interviewQuestions: [
              'Why is reverse-mode autodiff vastly more efficient than forward-mode for neural networks?',
              'How do you handle gradient accumulation when a node is referenced multiple times in a computation graph?',
            ],
            xpReward: 500,
            estimatedHours: scaleHours(12),
          },
        },
        {
          id: 'node-pytorch-custom',
          title: 'PyTorch CUDA Extensions & Kernel Tuning',
          subtitle: 'Custom C++/CUDA operator bindings, memory pinning & torch.compile',
          tier: 2,
          category: 'skill',
          prerequisites: ['node-py-perf', 'node-linalg-tensors'],
          estimatedHours: scaleHours(16),
          position: { x: 380, y: 160 },
          quest: {
            objective: 'Implement an optimized custom activation/loss CUDA kernel in PyTorch.',
            brief: 'Write a C++ / CUDA extension for an unrepresented activation or focal loss function, bind it with pybind11/TorchScript, and benchmark against naive PyTorch.',
            steps: [
              'Write forward and backward CUDA kernel using thread block tiling.',
              'Package extension with torch.utils.cpp_extension.',
              'Benchmark latency and memory footprint against pure PyTorch baseline using torch.profiler.',
            ],
            tangibleDeliverable: 'GitHub repo with CUDA extension, benchmark suite, and memory profiler traces.',
            deliverableType: 'github_repo',
            rubric: [
              { id: 'r1', name: 'Kernel Optimization', weight: 40, description: 'Achieves at least 2.5x speedup over eager PyTorch through memory fusing.', maxScore: 100 },
              { id: 'r2', name: 'Numerical Stability', weight: 30, description: 'Passes torch.autograd.gradcheck with zero precision warnings.', maxScore: 100 },
              { id: 'r3', name: 'Profiler Artifacts', weight: 30, description: 'Includes Chrome trace export highlighting kernel execution timing.', maxScore: 100 },
            ],
            curatedResources: [
              { title: 'Custom C++ and CUDA Extensions in PyTorch', url: 'https://pytorch.org/tutorials/advanced/cpp_extension.html', type: 'documentation' },
              { title: 'Programming Massively Parallel Processors (Hwu, Kirk, El Hajj)', url: 'https://www.sciencedirect.com/book/9780323912310/programming-massively-parallel-processors', type: 'guide' },
            ],
            interviewQuestions: [
              'What are warp divergence and shared memory bank conflicts in CUDA, and how do you avoid them?',
              'How does operator fusion in torch.compile reduce high bandwidth memory (HBM) round trips?',
            ],
            xpReward: 750,
            estimatedHours: scaleHours(16),
          },
        },
        {
          id: 'node-transformer-arch',
          title: 'Transformer Architecture & KV-Cache Internals',
          subtitle: 'Multi-head attention, rotary positional embeddings (RoPE) & FlashAttention mechanics',
          tier: 2,
          category: 'project',
          prerequisites: ['node-linalg-tensors'],
          estimatedHours: scaleHours(18),
          position: { x: 380, y: 340 },
          quest: {
            objective: 'Build a decoder-only LLM with FlashAttention-2 and dynamic KV-Cache.',
            brief: 'Implement a modern LLaMA/Mistral-style transformer architecture in PyTorch incorporating RoPE, RMSNorm, SwiGLU, and KV-cache generation.',
            steps: [
              'Implement Rotary Position Embedding (RoPE) with complex frequency rotations.',
              'Implement key-value cache buffer management for O(1) autoregressive generation steps.',
              'Benchmark generation throughput (tokens/sec) with and without KV-caching.',
            ],
            tangibleDeliverable: 'Clean PyTorch transformer implementation with text generation script and ablation benchmark.',
            deliverableType: 'github_repo',
            rubric: [
              { id: 'r1', name: 'RoPE & SwiGLU Precision', weight: 40, description: 'Exact mathematical equivalence verified against HuggingFace references.', maxScore: 100 },
              { id: 'r2', name: 'KV-Cache Efficiency', weight: 30, description: 'Demonstrates order-of-magnitude generation speedup as sequence length grows.', maxScore: 100 },
              { id: 'r3', name: 'Inference Benchmark', weight: 30, description: 'Clean token/s telemetry across batch sizes 1, 4, and 16.', maxScore: 100 },
            ],
            curatedResources: [
              { title: 'The Illustrated Transformer (Jay Alammar)', url: 'https://jalammar.github.io/illustrated-transformer/', type: 'guide' },
              { title: 'FlashAttention-2: Faster Attention with Better Parallelism (Dao)', url: 'https://arxiv.org/abs/2307.08691', type: 'paper' },
            ],
            interviewQuestions: [
              'Why does standard self-attention scale quadratically with sequence length, and how does FlashAttention optimize IO?',
              'How does Grouped-Query Attention (GQA) reduce KV-cache memory bandwidth consumption?',
            ],
            xpReward: 800,
            estimatedHours: scaleHours(18),
          },
        },
        {
          id: 'node-distributed-training',
          title: 'FSDP & Megatron-LM Distributed Scaling',
          subtitle: 'ZeRO-3 memory sharding, tensor parallelism & pipeline stages',
          tier: 3,
          category: 'skill',
          prerequisites: ['node-pytorch-custom', 'node-transformer-arch'],
          estimatedHours: scaleHours(20),
          position: { x: 680, y: 200 },
          quest: {
            objective: 'Scale fine-tuning across multi-GPU setups using PyTorch FSDP.',
            brief: 'Configure PyTorch Fully Sharded Data Parallel (FSDP) with mixed precision (bfloat16) and activation checkpointing to train a 7B parameter model.',
            steps: [
              'Configure FSDP auto_wrap_policy for transformer blocks.',
              'Implement gradient accumulation and activation checkpointing to prevent OOM.',
              'Profile NCCL all-reduce and all-gather communication overhead with torch.distributed.checkpoint.',
            ],
            tangibleDeliverable: 'Multi-GPU training launch script with memory scaling analysis report.',
            deliverableType: 'benchmark_report',
            rubric: [
              { id: 'r1', name: 'Zero OOM Scaling', weight: 40, description: 'Successfully fits target model within constrained GPU VRAM limits.', maxScore: 100 },
              { id: 'r2', name: 'Scaling Linearity', weight: 30, description: 'Demonstrates > 85% MFU (Model Flops Utilization) across devices.', maxScore: 100 },
              { id: 'r3', name: 'Fault Tolerance', weight: 30, description: 'Deterministic checkpoint saving and resumption without state divergence.', maxScore: 100 },
            ],
            curatedResources: [
              { title: 'PyTorch FSDP Getting Started Tutorial', url: 'https://pytorch.org/tutorials/intermediate/FSDP_tutorial.html', type: 'documentation' },
              { title: 'ZeRO: Memory Optimizations Toward Training Trillion Parameter Models', url: 'https://arxiv.org/abs/1910.02054', type: 'paper' },
            ],
            interviewQuestions: [
              'Compare ZeRO Stage 1, Stage 2, and Stage 3 in terms of communication vs memory trade-offs.',
              'How does activation checkpointing trade computational FLOPS for GPU memory capacity?',
            ],
            xpReward: 900,
            estimatedHours: scaleHours(20),
          },
        },
        {
          id: 'node-eval-benchmarks',
          title: 'Scientific pass@k Evaluation & LLM Benchmarking',
          subtitle: 'Statistical bootstrapping, GSM8k / HumanEval harnesses & contamination checks',
          tier: 3,
          category: 'milestone',
          prerequisites: ['node-transformer-arch'],
          estimatedHours: scaleHours(15),
          position: { x: 680, y: 360 },
          quest: {
            objective: 'Build an automated scientific evaluation pipeline for model checkpoint grading.',
            brief: 'Implement a rigorous evaluation harness using lm-evaluation-harness or custom pass@k sampling on HumanEval and GSM8k with 95% bootstrap confidence intervals.',
            steps: [
              'Implement unbiased pass@k estimator (Chen et al.).',
              'Run temperature ablation sweeps across 0.2, 0.7, and 1.0 with n=20 samples.',
              'Generate statistical confidence interval error bands and n-gram contamination audit.',
            ],
            tangibleDeliverable: 'Open-source benchmark evaluation report with interactive comparison plots.',
            deliverableType: 'benchmark_report',
            rubric: [
              { id: 'r1', name: 'Statistical Rigor', weight: 40, description: 'Unbiased estimator calculation with bootstrap confidence intervals.', maxScore: 100 },
              { id: 'r2', name: 'Contamination Audit', weight: 30, description: 'String n-gram overlap check between training corpus and benchmark tests.', maxScore: 100 },
              { id: 'r3', name: 'Visual Clarity', weight: 30, description: 'Clear publication-grade charts illustrating trade-offs.', maxScore: 100 },
            ],
            curatedResources: [
              { title: 'Evaluating Large Language Models Trained on Code (Chen et al.)', url: 'https://arxiv.org/abs/2107.03374', type: 'paper' },
              { title: 'EleutherAI lm-evaluation-harness Framework', url: 'https://github.com/EleutherAI/lm-evaluation-harness', type: 'documentation' },
            ],
            interviewQuestions: [
              'Why is the naive pass@k formula biased when k < n, and how does the hypergeometric estimator solve this?',
              'How do prompt format variations (few-shot vs zero-shot) confound model capability comparisons?',
            ],
            xpReward: 850,
            estimatedHours: scaleHours(15),
          },
        },
        {
          id: 'node-boss-battle-ai',
          title: 'Titan Neural Core: The Autonomous Model Nexus',
          subtitle: 'End-to-end foundation model training, quantization & high-throughput serving',
          tier: 4,
          category: 'boss_battle',
          prerequisites: ['node-distributed-training', 'node-eval-benchmarks'],
          estimatedHours: scaleHours(25),
          position: { x: 960, y: 270 },
          quest: {
            objective: 'Conquer the Titan Neural Core Capstone Boss Trial.',
            brief: 'Synthesize data curation, distributed LoRA fine-tuning, rigorous pass@k validation, and high-throughput vLLM deployment into a single production research pipeline.',
            steps: [
              'Execute distributed fine-tuning on domain-specific reasoning tasks.',
              'Quantize weights with AWQ/GPTQ and deploy via vLLM with PagedAttention.',
              'Publish production GitHub repository and comprehensive technical paper summary.',
            ],
            tangibleDeliverable: 'Full production GitHub repository, live API deployment, and technical research paper summary.',
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
            estimatedHours: scaleHours(25),
          },
        },
      ],
      edges: [
        { id: 'e1', source: 'node-py-perf', target: 'node-pytorch-custom', animated: true },
        { id: 'e2', source: 'node-linalg-tensors', target: 'node-pytorch-custom', animated: true },
        { id: 'e3', source: 'node-linalg-tensors', target: 'node-transformer-arch', animated: true },
        { id: 'e4', source: 'node-pytorch-custom', target: 'node-distributed-training', animated: true },
        { id: 'e5', source: 'node-transformer-arch', target: 'node-distributed-training', animated: true },
        { id: 'e6', source: 'node-transformer-arch', target: 'node-eval-benchmarks', animated: true },
        { id: 'e7', source: 'node-distributed-training', target: 'node-boss-battle-ai', animated: true },
        { id: 'e8', source: 'node-eval-benchmarks', target: 'node-boss-battle-ai', animated: true },
      ],
    };
  }

  // Pre-seed completed status for existing verified skills or skip topics
  const knownTokens = new Set<string>();
  (ctx.currentSkills || []).forEach((s) => {
    if (s.rating >= 3 || s.verification !== 'self_reported') {
      s.name.toLowerCase().split(/[\s,+/&]+/).forEach((t) => { if (t.length > 2) knownTokens.add(t); });
    }
  });
  (ctx.masteredTopicsToSkip || []).forEach((topic) => {
    topic.toLowerCase().split(/[\s,+/&]+/).forEach((t) => { if (t.length > 2) knownTokens.add(t); });
  });

  const processedNodes: RoadmapNode[] = template.nodes.map((n, idx) => {
    // Check if node title or subtitle matches known tokens
    const nodeText = `${n.title} ${n.subtitle} ${n.quest.objective}`.toLowerCase();
    const isKnown = n.tier === 1 && Array.from(knownTokens).some((token) => nodeText.includes(token));

    if (isKnown) {
      const matchingSkill = (ctx.currentSkills || []).find((s) =>
        nodeText.includes(s.name.toLowerCase())
      );
      return {
        ...n,
        status: 'completed',
        completedAt: new Date(Date.now() - 86400000 * (4 - idx)).toISOString().split('T')[0],
        evidenceSubmitted: {
          url: matchingSkill?.evidenceUrl || 'Verified baseline in Career DNA onboarding',
          note: `Pre-existing competency validated: ${matchingSkill?.name || n.title}. Prerequisite fulfilled.`,
          submittedAt: new Date().toISOString(),
        },
      };
    }

    return {
      ...n,
      status: n.prerequisites.length === 0 ? 'available' : 'locked',
    };
  });

  const bossBattle: BossBattle = {
    id: `boss-${Date.now()}`,
    title: template.bossTitle,
    codename: template.bossCodename,
    description: template.bossDescription,
    hpTotal: 4000,
    hpCurrent: 4000,
    requiredSkills: processedNodes.slice(0, 4).map((n) => n.title),
    phases: template.bossPhases.map((p) => ({ ...p, completed: false })),
    status: 'locked',
    lootSummary: `Verified ${ctx.targetRole} Elite Credential, Capstone Blueprint, +2000 XP`,
    xpReward: 2000,
  };

  return {
    nodes: processedNodes,
    edges: template.edges,
    bossBattle,
    roleDescription: template.description,
  };
}
