export interface Prompt {
  id: string;
  name?: string;
  version?: string;
  category?: string;
  subcategory?: string;
  tags?: string[];
  pillars?: string[];
  summary?: string;
  description?: string;
  safety?: {
    safety_clause?: string;
    disallowed?: string[];
    fallbacks?: string[];
  };
  evals?: {
    adversarial_tests?: string[];
  };
  inputs?: {
    name: string;
    type: string;
    required: boolean;
    description?: string;
    default?: any;
  }[];
  expected_outputs?: string[];
  actions?: string[];
  prompt?: string;
  system?: string;
  user_template?: string;
  few_shots?: {
    input: string;
    output: string;
  }[];
  provenance?: string;
  links?: {
    youtube?: string;
    docs?: string[];
  };
}

export interface DagNode {
  id: string;
  label?: string;
  title?: string;
  group?: string;
  role?: string;
  pillars?: string[];
  category?: string;
}

export interface DagEdge {
  from: string;
  to: string;
}

export interface DagData {
  nodes: DagNode[];
  edges: DagEdge[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
