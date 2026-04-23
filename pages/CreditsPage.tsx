import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  Coins,
  Euro,
  PackageCheck,
  PoundSterling,
  Wallet,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  clampCredits,
  CREDIT_PACK_CONFIG,
  FIGMA_KIT_SUMMARY,
  formatCreditCost,
  formatCurrencyAmount,
  getCreditQuote,
  getPublishedFigmaKits,
} from "../data/figmaKits";
import { useAppSession } from "../contexts/AppSessionContext";
import { RUNTIME_CONFIG } from "../services/runtimeConfig";
