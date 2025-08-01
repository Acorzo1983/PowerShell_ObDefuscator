// version 1.1.0
import { Model } from '../types';

/**
 * Models for the DEOBFUSCATOR (Analysis).
 * Expanded, verified list of models that reliably support Tool Use / Function Calling.
 */
export const analysisModels: Model[] = [
    { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet (Best Overall)', isFree: false, supportsAnalysis: true },
    { id: 'openai/gpt-4o', name: 'OpenAI GPT-4o (Powerful)', isFree: false, supportsAnalysis: true },
    { id: 'google/gemini-1.5-pro-latest', name: 'Google Gemini 1.5 Pro', isFree: false, supportsAnalysis: true },
    { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus (Deep Analysis)', isFree: false, supportsAnalysis: true },
    { id: 'mistralai/mistral-large-latest', name: 'Mistral Large', isFree: false, supportsAnalysis: true },
    { id: 'anthropic/claude-3-sonnet', name: 'Claude 3 Sonnet (Balanced)', isFree: false, supportsAnalysis: true },
    { id: 'meta-llama/llama-3-70b-instruct', name: 'Meta Llama 3 70B', isFree: false, supportsAnalysis: true },
    { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku (Fast & Cheap)', isFree: false, supportsAnalysis: true },
    { id: 'mistralai/mixtral-8x22b-instruct', name: 'Mixtral 8x22B Instruct', isFree: false, supportsAnalysis: true },
    { id: 'databricks/dbrx-instruct', name: 'Databricks DBRX Instruct', isFree: false, supportsAnalysis: true },
    { id: 'google/gemma-2-9b-it', name: 'Google Gemma 2 9B', isFree: false, supportsAnalysis: true },
    // Free Tier
    { id: 'nousresearch/hermes-2-pro-llama-3-8b:free', name: 'Hermes 2 Pro Llama 3 (Free)', isFree: true, supportsAnalysis: true },
    { id: 'google/gemma-7b-it:free', name: 'Google Gemma 7B (Free)', isFree: true, supportsAnalysis: true },
    { id: 'mistralai/mistral-7b-instruct:free', name: 'Mistral 7B Instruct (Free)', isFree: true, supportsAnalysis: true },
    { id: 'openchat/openchat-7b:free', name: 'OpenChat 7B (Free)', isFree: true, supportsAnalysis: true },
];

/**
 * Models for the OBFUSCATOR (Code Generation).
 * Expanded, verified list of models that excel at code generation.
 */
export const obfuscationModels: Model[] = [
    { id: 'mistralai/codestral-latest', name: 'Mistral Codestral (Best for Code)', isFree: false, supportsAnalysis: true },
    { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet (Creative)', isFree: false, supportsAnalysis: true },
    { id: 'deepseek/deepseek-coder-v2-instruct', name: 'DeepSeek Coder v2', isFree: false, supportsAnalysis: false },
    { id: 'meta-llama/llama-3-70b-instruct', name: 'Meta Llama 3 70B (Powerful)', isFree: false, supportsAnalysis: true },
    { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku (Fast)', isFree: false, supportsAnalysis: true },
    { id: 'openai/gpt-4o', name: 'OpenAI GPT-4o (All-Rounder)', isFree: false, supportsAnalysis: true },
    { id: 'google/gemini-1.5-pro-latest', name: 'Google Gemini 1.5 Pro', isFree: false, supportsAnalysis: true },
    { id: 'mistralai/mixtral-8x22b-instruct', name: 'Mixtral 8x22B Instruct', isFree: false, supportsAnalysis: true },
    { id: 'phind/phind-coder-v2', name: 'Phind Coder v2', isFree: false, supportsAnalysis: false },
    { id: 'wizardlm/wizardlm-2-8x22b', name: 'WizardLM-2 8x22B', isFree: false, supportsAnalysis: true },
    { id: 'google/gemma-2-9b-it', name: 'Google Gemma 2 9B', isFree: false, supportsAnalysis: true },
    // Free Tier
    { id: 'qwen/qwen-72b-chat:free', name: 'Qwen 72B Chat (Free)', isFree: true, supportsAnalysis: false },
    { id: 'nousresearch/hermes-2-pro-llama-3-8b:free', name: 'Hermes 2 Pro Llama 3 (Free)', isFree: true, supportsAnalysis: true },
    { id: 'mistralai/mistral-7b-instruct:free', name: 'Mistral 7B Instruct (Free)', isFree: true, supportsAnalysis: true },
    { id: 'openchat/openchat-7b:free', name: 'OpenChat 7B (Free)', isFree: true, supportsAnalysis: true },
];
