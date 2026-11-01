# Mock viva notes: ceRNA network and prognostic signature chapter

Source: `Chapter3/main.tex` (printed in the thesis as **Chapter 5**; the folder number does not match the heading).
Under peer review at Scientific Reports.

Tags used below:

- **[VERIFY]** a fact I could not confirm from the chapter; check your scripts, notes or the source paper.
- **[CITE]** a claim that needs a reference.
- **[CLARIFY]** an ambiguity in the chapter or in your answer to resolve before the viva.

---

## Q1. What shows that the ceRNA network step adds prognostic value, beyond the 23 genes simply being a DE subset of mRNAs?

**Prompt in the chapter:** the abstract concludes the signature "highlight[s] the utility of modelling transcriptomic signatures through the lens of regulatory RNA interactions". Methods use circRNAs and miRNAs only as filters; the surviving DE-mRNAs plus Gleason and PSA are the only CoxBoost inputs.

**Your answer (summary):**

- The mRNAs come from the ceRNA network, giving a 23-gene signature, 21 of which are not in published signatures.
- Validation results are modest, but published signatures only report apparent validation because their coefficients were not published.
- You would add three models: (1) Gleason + PSA, (2) the 23-gene signature, (3) clinical + signature. You would compare Harrell's C-index, the hazard ratio, and a likelihood ratio test, and run internal-external cross-validation to see whether the combined model rescues poor C-index scores.

**Examiner feedback:**

- The clinical vs clinical + signature comparison tests the *incremental value of the signature*, not the *value of the ceRNA step*. A signature from DE-mRNAs without network filtering could show the same gain.
- Being distinct from published signatures (21 of 23 genes) is not evidence of being better.
- The comparison to published signatures is not like-for-like if they were refitted in the validation cohort. This makes the comparison unfair to you, but it also means it cannot support any superiority claim.
- [CLARIFY] The clinical-only comparison was not found in the sections read. Check whether it exists elsewhere in the chapter or supplement.

**Improved answer:**

"The ceRNA network is a biologically motivated way to reduce the feature space before modelling: from the DE-mRNAs it keeps only those with a predicted circRNA-miRNA-mRNA route and opposing fold-change directions. In the chapter I show that the resulting 23-gene signature has reasonable discrimination (C-index 0.73 apparent, 0.68 optimism-corrected, 0.71 in the external cohort), and that it is largely distinct from published signatures, with only SFRP4 and BGN shared. What the chapter does not show is that the network step itself is responsible for the prognostic signal, or that the signature improves on Gleason and PSA. Those are separate questions, and I would test both. For incremental value, I would fit clinical-only, signature-only and combined Cox models in the derivation set, compare them with a likelihood ratio test, and report the change in C-index and hazard ratio, including in internal-external cross-validation. For the value of the ceRNA step, see Q2. I would present the ceRNA derivation as a hypothesis-generating feature-reduction strategy rather than as demonstrated to improve prognosis, and I treat the comparison to published signatures as indicative only, since most report apparent performance."

---

## Q2. What control would show that ceRNA-derived mRNAs carry more prognostic information than a comparable set that did not go through the network? What result would make you drop the claim?

**Your answer:** "I actually don't know."

**Model answer (provided at your request, after discussion):**

The claim to test is: *for a fixed pipeline (CoxBoost + Schoenfeld filtering, same clinical covariates, same cohorts), restricting the input mRNAs to the ceRNA network improves out-of-sample prognosis compared with other input sets of the same kind.* Suitable controls, from most to least important:

1. **DE-only baseline.** Run the identical CoxBoost pipeline on all mRNAs that pass the same co-expression filter (DE in both PCa vs normal and enzalutamide-resistant vs sensitive, same direction: 691 up + 619 down unique overlapping mRNAs in the chapter's table), without the circRNA/miRNA steps. Compare to the ceRNA-restricted model.
2. **Size-matched random sets.** Draw many random sets of mRNAs the same size as the ceRNA mRNA set, from (a) the DE-overlap mRNAs and (b) all mRNAs measured on the platforms. Run the full pipeline on each, and build a null distribution of the internal-external cross-validation pooled C-index. Report where the ceRNA-derived model falls (empirical p-value).
3. **Network-label permutation.** Keep the network structure but shuffle which mRNAs are assigned to which miRNAs, or use random miRNA-mRNA pairs with matched degree. This tests whether the specific interactions matter or only the set size.
4. **Drop the opposing fold-change filter.** Build the network from predicted interactions only, to test whether the expression-based ceRNA filter adds anything beyond sequence-based prediction.

**Evaluation:** use the same bootstrap optimism-corrected C-index and internal-external cross-validation (pooled C-index with confidence interval and heterogeneity) used for the main model, plus the held-out external cohort. Compare the models with likelihood ratio tests, or with C-index differences using a paired bootstrap across the same resamples.

**What would make you drop the claim:** if the ceRNA-derived model's pooled C-index sits within the central mass of the random-set null distribution (not clearly in the upper tail), or is not better than the DE-only baseline in internal-external cross-validation and the external cohort. In that case, the honest conclusion is that the ceRNA step is a defensible, interpretable feature-reduction step but not a demonstrated source of prognostic value.

**Caveats to state in the viva:**

- The network is built from predicted interactions (CircBase, CSCD, miRTarBase, miRNet, TargetScan), so a prognostic gene does not show that the circRNA-miRNA-mRNA axis is functioning in patients. [CLARIFY]
- The circRNA and miRNA data come from cell line and different cohorts; the prognostic data are mRNA only, so circRNA and miRNA levels are never tested for prognosis in the survival cohorts. [CLARIFY]
- A single external cohort gives wide uncertainty (e.g. validation calibration slope 1.33, 95% CI 0.59-2.06; HR CI 0.52-2.44).

---

## Q3. Why should genes that are DE between tumour and normal, or resistant and sensitive, predict recurrence within tumours? How do you reconcile SPARC (downregulated in your DE, but linked to metastasis and higher Gleason in the literature you cite)?

**Prompt in the chapter:** Methods select co-expressed DE genes from PCa vs normal and ENZ-resistant vs ENZ-sensitive contrasts; the model then predicts time to BCR among PCa patients. Discussion: SPARC -0.48 logFC "contradicts" studies linking higher expression to metastasis, but is said to agree with studies showing it is downregulated in PCa.

**Your answer (summary):**

- A subpopulation (~10%) of LNCaP clones shows EMT pathways, plasticity and a refractory response to enzalutamide.
- The same signatures are found in patient cohorts and are associated with BCR.
- Shared subpopulations could therefore drive both biochemical recurrence after radical therapy and enzalutamide resistance.

**Examiner feedback:**

- A biologically coherent rationale: it gives a mechanism (shared EMT/plasticity programme) for why the two contrasts could overlap with recurrence.
- However, the chapter text I read never mentions EMT, plasticity or subpopulations (searches for those terms find only the "Clone 1/Clone 9" table labels). The strongest part of your defence is therefore not in the thesis. [CLARIFY] Add it to the Introduction or Discussion, with references. [CITE] the ~10% subpopulation figure and the patient-cohort EMT/BCR evidence.
- The answer did not address SPARC directly. SPARC is itself an EMT-associated gene, so the EMT rationale would predict *up*regulation, not the -0.48 logFC you observed. This is the gap an examiner would press.
- "Possible" is carrying a lot of weight. Bulk expression cannot show that a subpopulation is the driver; no analysis in the chapter tests the EMT link.
- The DE contrasts and the outcome are different questions. Tumour vs normal compares tissue composition (stroma, epithelium) as well as cancer biology; resistant vs sensitive clones are cell-line derivatives. DE direction does not imply prognostic direction, which the chapter's own gene-level HRs illustrate (most CIs include 1).

**Improved answer:**

"The selection step is a hypothesis, not a guarantee. The rationale is that BCR after radical therapy and acquired enzalutamide resistance may share a downstream cell state: a plastic, EMT-like subpopulation, which has been described in enzalutamide-resistant LNCaP derivatives and in patient tumours that recur [CITE]. Genes that move in the same direction in both the tumour-vs-normal and resistant-vs-sensitive contrasts are therefore enriched for programmes shared between initiation, resistance and progression, and that is why I intersect the contrasts. This is a feature-reduction heuristic, and I do not claim DE direction determines prognostic direction. The model's coefficients, not the logFC, decide each gene's prognostic role, and for most genes the individual hazard ratios are small with confidence intervals including 1 (for example BGN 1.12, 0.95-1.32), so the signal is carried by the combination. SPARC illustrates the limitation: it is downregulated in my contrasts, consistent with several PCa studies showing reduced expression in tumour, but is associated with metastasis and higher Gleason in others; SPARC is also one of the genes with higher between-study slope variance in my analysis. Tissue composition is a plausible explanation, since SPARC is stromal as well as epithelial, and the direction of its effect on BCR could differ between bulk cohorts. I would test the EMT hypothesis directly by (i) running enrichment on the 23 genes and on the full ceRNA mRNA set, (ii) checking the correlation of the signature score with an EMT score in the cohorts, and (iii) asking whether the signature's prognostic value persists after adjusting for that EMT score."

**Reviewer response (condensed, from the Scientific Reports review):**

- Single-cell profiling of treatment-naive, androgen-dependent LNCaP shows ~10% of cells pre-exist as an AR-low subpopulation with EMT, stemness and a refractory response to androgen deprivation, consistent with earlier bulk RNA-Seq. [CITE] refs 7, 8 in the response letter.
- Under enzalutamide selection these pre-existing subclones expand and drive resistance.
- Clinical tumour analyses link this pre-existing AR-low/EMT/stemness programme to higher BCR risk and later enzalutamide resistance. [CITE] refs 9, 10 in the response letter.
- Post-prostatectomy recurrence and enzalutamide resistance may therefore share a mechanism: expansion of invasive, lineage-plastic survival programmes that operate independently of canonical AR signalling.
- Intersecting patient-derived tumour transcriptomes with anti-androgen-resistance models should enrich for these pre-existing mediators of recurrence.

**Examiner view of the reviewer response:**

- Stronger than the first answer: it explains *why* the intersection is rational (a pre-existing, selectable cell state), and gives sources. This is the argument to put in the Introduction and Discussion.
- It is still a hypothesis. The claim that the intersection "enriches for pre-existing mediators" is untested in the chapter. A direct test: overlap of the 23 genes (and the full ceRNA mRNA set) with published AR-low/EMT/stemness gene sets, and enrichment analysis.
- It does not resolve SPARC. An EMT-associated gene downregulated in your contrasts needs a specific explanation (e.g. stromal vs epithelial origin, bulk-tissue composition).
- Scale mismatch: the programme sits in ~10% of cells, but your data are bulk. Say why a minority-population signal would be detectable in bulk, or concede it is diluted.
- A narrative of "common mechanism" says nothing about prognosis beyond Gleason and PSA (see Q1).
- [CLARIFY] The chapter text I read still contains none of this. Check the revised manuscript or add it to the thesis.

**Improved answer (use this in the viva):**

"The selection step is a hypothesis-driven enrichment strategy. Single-cell work shows that about 10% of treatment-naive LNCaP cells pre-exist as an AR-low population with EMT and stemness features and a poor response to androgen deprivation. Enzalutamide selects for these cells, and clinical analyses link the same programme to biochemical recurrence and later enzalutamide resistance [CITE]. Biochemical recurrence after surgery and enzalutamide resistance may therefore share a lineage-plastic survival programme independent of canonical AR signalling. Genes that change in the same direction in tumour-vs-normal and resistant-vs-sensitive contrasts are enriched for that shared programme, and the circRNA-miRNA layer further restricts them to genes with a predicted post-transcriptional regulatory route. This is a feature-reduction heuristic and I do not claim DE direction equals prognostic direction: the model coefficients decide each gene's role. Two things are not shown in the chapter. First, I have not demonstrated that the 23 genes are enriched for AR-low/EMT/stemness programmes, which I would test with gene-set overlap and enrichment analysis. Second, SPARC, which is stromal as well as epithelial, is downregulated in my contrasts although the literature links it to metastasis, so I would not claim it as a mechanistic driver; its higher between-study slope variance suggests its effect depends on the cohort."

---

## Q4. Is a calibration slope well above 1 (validation 1.33, pooled IECV 1.61) a good result? What would it mean for a clinician, and is the model still "robust"?

**Prompt in the chapter:** Table 5.2 reports a calibration slope of 1.59 (derivation) and 1.33 (validation, 95% CI 0.59-2.06). Internal-external cross-validation gives slopes from 1.19 to 2.28 with a pooled estimate of 1.61 (95% CI 1.35-1.86). The text calls the validation slope "adequate predictive reliability" and "underfitting rather than overfitting".

**Your answer (summary):**

- The derivation slope is above 1 because CoxBoost shrinks the coefficients. An unpenalised Cox model would give 1 in the derivation data, the expected value in the literature.
- 1.61 is "adequate" because it is close to 1.33, and the slope should be well maintained between cohorts.
- You asked for more information on clinical use.

**Examiner feedback:**

- Convincing: the shrinkage point is correct. An unpenalised Cox model has an apparent calibration slope of 1 by construction, so a derivation slope of 1.59 is a consequence of penalised fitting.
- Correct the numbers: 1.61 is the pooled **internal-external** estimate, not the derivation slope. The derivation slope is 1.59 and the validation slope is 1.33.
- The benchmark is 1, not the derivation slope. Because the derivation slope is inflated by shrinkage, "close to the derivation value" does not show good calibration. It shows consistent over-shrinkage.
- The validation CI (0.59-2.06) includes 1 and is also compatible with a slope of 2, so the data cannot distinguish good calibration from substantial under-dispersion.
- The chapter's calibration curves show over-estimated risk at low predicted risk and under-estimated risk at high predicted risk. That is a separate problem from the slope and matters more for clinical use.

**Improved answer:**

"A calibration slope above 1 means the prognostic index is under-dispersed: the model ranks patients sensibly, but its predictions are too compressed, so true differences in risk are larger than the model implies. In my case this is expected, because CoxBoost shrinks the coefficients, so even the derivation slope is 1.59 rather than 1. I would therefore not use agreement with the derivation slope as evidence of good calibration; the benchmark is 1. The validation slope of 1.33 is compatible with 1 given its wide interval (0.59-2.06), but equally with 2, and the internal-external pooled slope of 1.61 (CI 1.35-1.86) shows a consistent tendency to under-dispersion. The practical consequence is that the model is better thought of as a ranking tool than as a tool for absolute risk. A recalibration step (rescaling the prognostic index by the estimated slope, with the baseline hazard re-estimated) would be needed before absolute 5-year risk could be quoted, and that recalibration should be assessed in new data. I would therefore describe the model as showing stable discrimination (C-index 0.68-0.71 after correction and in the external cohort), but not yet as well calibrated or clinically ready."

**Clinical use (supplied at your request):**

1. **Slope and absolute risk are different things.** The slope applies to the prognostic index (relative effects). Clinicians act on absolute risk over a time horizon (for example, whether to offer adjuvant therapy or intensify follow-up), which also depends on the baseline hazard. Calibration curves are the relevant check, and yours show miscalibration at both ends of the risk range, exactly where decision thresholds sit.
2. **Added value over clinical variables is not shown.** Clinicians already have Gleason and PSA. A model is clinically useful only if it improves decisions beyond them, which needs the clinical-only comparison (Q1), a likelihood ratio test, and ideally a decision-curve analysis (net benefit across plausible thresholds).
3. **Per-dataset centring and scaling.** The Methods centre and scale each dataset before modelling. A new patient cannot be centred and scaled against their own cohort, so applying the model to one patient needs a fixed reference distribution or a platform-specific normalisation. [CLARIFY] How would a new sample be scored?
4. **Median-split risk groups.** The chapter defines risk groups by the median prognostic index. A median recomputed in each cohort is not transportable; a fixed cut-off from the derivation data would be needed. [CLARIFY] Which median is used in the validation cohort?
5. **Modest discrimination and a single external cohort.** Optimism-corrected C 0.68; validation C 0.71 with wide intervals (HR CI 0.52-2.44), and moderate heterogeneity (I² 43.3% for the calibration slope).
6. **Endpoint.** BCR is a surrogate for clinically meaningful outcomes (metastasis, cancer-specific survival).
7. **Stage of development.** This is a development and internal-external validation study. Next steps would be prospective or independent external validation, reporting to TRIPOD standards, and impact assessment.

---

## Q5. Does the bootstrap optimism estimate capture all data-driven steps that produced the 23 genes? Does reusing TCGA-PRAD for network construction and for model development bias the cross-validation, especially when TCGA is held out?

**Prompt in the chapter:** the optimism bootstrap repeats CoxBoost selection and fitting in each resample, but the ceRNA network is built once beforehand. The mRNA and miRNA tumour-vs-normal contrasts use TCGA-PRAD (Supplementary Table 1), and TCGA is also one of the nine derivation studies.

**Your answer (summary):**

- The optimism correction does not recompute the network; it only repeats CoxBoost on the resampled derivation data.
- You accept that TCGA-PRAD is used both for DE and for model evaluation ("double dipping"), and defend it because TCGA-PRAD is the largest dataset with time-to-BCR events and omitting it would cost power.
- You do not think the network should be recomputed in the bootstrap: most contrasts have ~3 samples, so a bootstrap would be infeasible.
- On whether the TCGA double dipping matters: "I'm not sure".

**Examiner feedback:**

- Convincing: candid about the double use of TCGA-PRAD, and a reasonable power argument for keeping TCGA in model development.
- The justification for not recomputing the network was about *feasibility*, not *validity*. The principled argument is different (see below).
- You did not say whether the double dipping biases the estimates, or how large the effect is. That was the question.
- Not shown: any analysis demonstrating the effect is small.

**Improved answer:**

"The optimism bootstrap in the chapter covers the outcome-driven steps, CoxBoost selection and fitting, which are the main source of optimism. The ceRNA network is built once from differential expression contrasts (tumour vs normal, resistant vs sensitive) and database interactions. None of those steps use time to BCR, so they are outcome-independent. Outcome-independent filtering does not leak the survival outcome into the performance estimate in the way supervised selection does, so leaving it out of the bootstrap should cause little underestimation of optimism. The practical point that the network is built from small contrasts (about three samples) that cannot be meaningfully resampled supports this, but it is a reason of feasibility, and I would say so separately.

TCGA-PRAD is where I have a residual concern. Its tumour expression data are used to define the candidate genes and then also appear in model development, and in the internal-external cross-validation fold where TCGA is held out, the held-out study has therefore influenced the candidate set. The survival outcome was not used, so I do not expect a large bias, but the TCGA fold is not strictly external, and it should not be read as a fully independent estimate. I kept TCGA in the derivation data because it is the largest cohort with BCR events. To assess the effect, I would (a) report the TCGA fold separately and check whether it is out of line with the other eight (the C-index range is 0.68-0.84), and (b) repeat the analysis with the network built without TCGA-PRAD, or with TCGA excluded from model development and used as an additional validation cohort, and compare the C-index and the selected genes. If the conclusions do not change, the double use is a minor limitation. If they do, the TCGA fold should be treated as non-independent."

**Notes on the options:**

- [VERIFY] If TCGA-PRAD is the only tumour-vs-normal dataset for the mRNA and/or miRNA layers, removing it from the network is not possible without another tumour-vs-normal dataset. Check Supplementary Tables 1 and 2.
- [VERIFY] Which study gave the highest C-index (0.84) in the internal-external cross-validation? If it is TCGA, state it.
- [CLARIFY] Are the Schoenfeld residual filtering and the minstepno/maxstepno settings repeated within each bootstrap resample?

---

## Q6. How stable is a signature whose most frequently selected gene appears in only ~half of the bootstrap resamples? What does it say about presenting these 23 genes as "the signature"?

**Prompt in the chapter:** bootstrap selection frequencies out of 200: RNASEH2C 105, SSTR1 102, SPARC 94, BGN 84, LIX1 68, NEU3 60; MAPK8IP2 21 and B4GALT1 16 (both in the final model); Gleason 118 (not retained). The Discussion says this highlights "a core subset of genes with robust selection frequencies".

**Your answer (summary):**

- Between-study variance of gene effects (random slope models) is low for most genes; only a few have high variance, and B4GALT1 and MAPK8IP2 are not among them.
- Gleason was the most frequently selected, but the bootstrap was not used to re-select features, because that would be data peeking. It was used only to test the stability of the predictors.

**Examiner feedback:**

- Convincing: not re-selecting from bootstrap frequencies is correct practice. Using them to choose genes after the fact would add a data-driven step that the same bootstrap cannot then assess.
- Two different things are being mixed. *Between-study variance of a gene's effect* measures whether the effect is consistent across cohorts. *Selection frequency* measures whether CoxBoost picks that gene when the data are resampled. A gene can have a stable effect in every study and still be picked rarely, for example because it is correlated with other genes and CoxBoost chooses between them. Low heterogeneity therefore does not answer the stability question.
- Low variance is expected when the effect is near zero. Several gene hazard ratios are small with CIs including 1 (B4GALT1 0.94, 0.84-1.05; MAPK8IP2 1.07, 0.95-1.21). Their slope variance is small mainly because the effects are small. Variance should be read relative to effect size.
- Correct the detail: the chapter text names four genes with elevated variance (PHYHD1, LIX1, MTERF4, SPARC, up to 0.13) and says 18 of 23 are low variance, which means five are not low. [CLARIFY] Make the text and your answer agree.
- The question was not answered: what does a top selection frequency of ~52% mean for presenting the 23 genes as "the signature"?
- "Robust selection frequencies" in the Discussion overstates the result. Reword.

**Improved answer:**

"The bootstrap shows that the specific 23-gene set is one realisation of an unstable selection process. The most frequently selected gene, RNASEH2C, appears in 105 of 200 resamples (about 52%), and two genes in the final model, B4GALT1 and MAPK8IP2, appear in under 11%. This is expected when many correlated candidate genes carry small effects and the sample provides limited events per candidate. I therefore treat the 23 genes as a prognostic model whose overall discrimination is validated, not as a list of individually validated biomarkers, and I would reword the Discussion, which calls the selection frequencies robust. Two points are separate from this. First, I did not use the bootstrap frequencies to re-select genes, as that would add an unassessed data-driven step; they are a stability diagnostic. Second, the random-slope analysis addresses between-study heterogeneity of effect, not selection stability, and the small variances partly reflect small effects. I would report selection frequencies alongside each gene in the signature, state that Gleason was selected more often than any gene but was not retained in the original fit (which illustrates that the single fit is one draw of an unstable procedure), and suggest that confidence in individual genes requires validation in independent cohorts, for example through a pre-specified stability-selection analysis or a clustering of correlated genes to see whether selection moves between members of the same cluster."

---

## Q7. What supports the ceRNA mechanism (circRNA sequestering miRNA enough to change its targets), as opposed to a set of co-varying RNAs that fit a sponge-shaped pattern? What would you need to show?

**Prompt in the chapter:** the network combines predicted circRNA-miRNA pairs (CircBase, CSCD), miRNA-mRNA targets (miRBase, miRTarBase, miRNet, TargetScan) and an opposite-direction filter (down-up-down or up-down-up). The enzalutamide contrasts are small (~3 per group) and the circRNA data are from a microarray.

**Your answer (summary):**

- You have no direct answer. The datasets are separate, so you cannot say that an RNA upregulated in one GEO dataset caused a downregulated partner in another. The network is hypothetical, following the ceRNA model.

**Examiner feedback:**

- Convincing: honest and correct that the network is a hypothesis built from predictions and expression direction, not evidence of mechanism. That is the right position, and it should be stated in the thesis.
- Needs strengthening: "entirely separate datasets" is not quite right for the enzalutamide data. The Methods tables list Clone 1, Clone 9 and control (n=3) for the circRNA (GSE118959), miRNA (GSE312115) and in-house mRNA data, so these layers come from the same cell-line model. [VERIFY] Whether they come from the same RNA extractions. If so, a direct correlation across samples is possible (limited by n), and you can say so.
- The answer stops at "I have no answer". An examiner expects you to say what evidence would settle it and how that limits your claims.
- A pointed risk: the Introduction cites Denzler et al. (2014) in support of circRNAs as ceRNAs. [VERIFY] that paper: it is generally cited for quantitative measurements arguing that ceRNA effects need high target-site abundance relative to the miRNA and are unlikely for most RNAs. Check how it is used.

**Better answer:**

"The ceRNA network in this chapter is a predicted, hypothesis-generating filter. Each edge rests on three things: predicted or database-supported miRNA response elements, differential expression in separate cohorts, and a requirement of opposite fold-change direction. None of these demonstrates sequestration. Specifically: (1) *Binding-site number and abundance.* Quantitative work argues that a competitor must carry many sites and be abundant relative to the miRNA to measurably de-repress targets; most circRNAs have few sites for any given miRNA (CDR1as/ciRS-7 is the exception), and I did not measure circRNA or miRNA copy number. (2) *Abundance is not activity.* Opposite directions between a circRNA and a miRNA are not required for sponging, and a miRNA's level does not equal its activity; sponging may leave abundance unchanged. The opposite-direction rule is a heuristic that follows the textbook ceRNA model. (3) *Predicted versus supported.* TargetScan edges are sequence predictions, and database support (for example miRTarBase) is mostly from other cell types and contexts. (4) *Power and design.* The enzalutamide contrasts are small, and the layers come from different platforms. For the Clone 1/Clone 9 data the three layers come from the same cell-line model, but with three replicates per group I cannot reliably test circRNA-miRNA-mRNA correlation.

To show that the network reflects ceRNA activity I would need: AGO2 CLIP or RIP support for the specific circRNA-miRNA and miRNA-mRNA interactions; binding-site counts and copy-number estimates showing the circRNA could titrate the miRNA; matched multi-omic samples tested for partial correlation; and perturbation (knock down the circRNA by targeting the back-splice junction, or overexpress it, and measure miRNA activity with a reporter and the target mRNAs), or luciferase assays of the binding sites.

None of this is needed for the chapter's main claim. The prognostic result is statistical: the model's discrimination is validated regardless of mechanism. I therefore present the ceRNA network as a biologically motivated feature-selection step, use 'putative' or 'predicted' when describing it, and I would soften the abstract's claim about 'the lens of regulatory RNA interactions' unless the comparison with a non-network control (Q2) shows that the network step adds value."

---

## Q8. What can the comparison to published signatures (Table 3) support, given that the published models were built from gene lists and appear to be fitted in the validation data, while yours was validated with fixed coefficients?

**Prompt in the chapter:** 30 published signatures were converted to Cox models "representative of each signature" because coefficients were largely unavailable, so the comparison "is based on feature selection alone". In Table 3, 15 of the 17 published signatures shown have a higher C-index than yours (0.71): only Ding (0.64) and Talantov (0.61) are lower; Long reaches 0.98. The Discussion says your signature "obtained moderate predictive power ... when compared to previously published signatures".

**Your answer (summary):**

- A fair comparison would need the fixed coefficients of the published signatures; otherwise their apparent performance is being presented.
- The table is reported for a fair, honest evaluation, not to claim superiority; it shows that ceRNA-derived models could be a hypothesis-generating tool, since most genes are private.

**Examiner feedback:**

- Convincing: you identify the right flaw (apparent versus validated performance) and you make no superiority claim.
- A contradiction to resolve: you call the table a "fair evaluation", but the asymmetry you describe means it is not like-for-like and cannot rank the signatures. State that plainly and caption the table accordingly.
- The direction of the table is unfavourable (yours is third lowest of 18) while the Discussion wording ("moderate ... compared to published signatures") reads as neutral to favourable. Say what the table does and does not show.
- "Most genes are private" shows the sets are different, not that the ceRNA step is useful (see Q2). Distinct gene sets with similar prognostic value are common in high-dimensional data, because many different gene sets are prognostic [CITE] Venet et al. 2011, PLoS Comput Biol, on random signatures in breast cancer. So privacy alone is weak evidence for hypothesis generation.
- You do not need the published coefficients to make a fair comparison. You have the gene lists and the derivation data (see below).

**Improved answer:**

"Table 3 does not support a ranking of the signatures, and I do not claim one. The published models were built from the gene lists alone and, as I understand the analysis, fitted in the validation dataset, so their numbers are apparent performance, whereas my signature was validated with coefficients fixed in the derivation data. This favours the published signatures, and my signature still ranks low, so the table is better read as showing that my model is not a clear improvement, with the comparison itself uninterpretable at the margin. The fair design uses the information I already have: for each published gene list, fit the same model in the derivation dataset (same Cox procedure, same penalisation or an unpenalised Cox model), fix the coefficients, and apply them to the validation dataset, with the same bootstrap or internal-external cross-validation for all of them. Differences in C-index should then be reported with confidence intervals (for example a paired bootstrap) alongside a clinical-only baseline and, where possible, size-matched random gene sets. That would also address Q2. The claim I can defend is that the ceRNA step generated a prognostically informative and largely distinct gene set that merits further evaluation, not that it generated a better one, and the fact that the genes are private is not itself evidence for the ceRNA approach."

---

## Q9. (Unanswered) What can the external validation show with 14 events and a 23-gene model? Would you keep the word "robust"?

**Prompt in the chapter:** Supplementary Table 3 lists the external validation cohort as GSE46602 (14 BCR events / 36 patients, Affymetrix GPL570). Reported: calibration slope 1.33 (95% CI 0.59-2.06), high-risk HR 1.48 (95% CI 0.52-2.44), C-index 0.71, AUCs 0.67 / 0.78 / 0.87 at 1 / 3 / 5 years. Results say performance "remained robust, supporting the portability of the ceRNA network-derived prognostic model".

**Points to prepare (not yet answered):**

- 14 events for a 23-gene model is under 1 event per candidate predictor, far below the 15-50 per predictor the Methods used for development. Validation studies commonly need on the order of 100 or more events for precise estimates of calibration and discrimination, so these estimates are very imprecise.
- The intervals show it: the slope CI (0.59-2.06) includes 1 and 2, and the HR CI (0.52-2.44) includes 1. A reported *P* value of 0.00257 for the HR conflicts with a CI that includes 1; check the table. [CLARIFY]
- AUC rising from 0.67 to 0.87 with horizon is based on very few events at each time point; the early-horizon estimates are especially noisy, and the text says "year 2" where the table says "year 3". [CLARIFY]
- The published signatures refitted in 14 events are overfitted by construction, which explains values such as Long 0.98 (Q8). This weakens the comparison rather than strengthening your result.
- Reasonable wording: "performance was consistent with the derivation and internal-external results, but the single small validation cohort provides only weak evidence of portability."
- [VERIFY] Supplementary Table 3 lists CIT and GSE54460 with the same accession (GSE54460), once as CIT (13/77) and once as GSE54460 (40/91), both citing Long et al. 2014. Check whether this is a typo or an overlap between derivation studies.
- [VERIFY] Is the external validation cohort on a different platform from the derivation studies (GPL570 microarray vs RNA-seq and other arrays)? How were the 23 genes mapped and scaled?

---

## Glossary: Schoenfeld residual filtering

**What it checks:** the proportional hazards (PH) assumption of the Cox model. PH says each predictor's hazard ratio is constant over follow-up time.

**Schoenfeld residuals:** for each event time and each predictor, the difference between the predictor value of the patient who had the event and the risk-weighted average of that predictor among everyone still at risk at that time. If PH holds, these residuals show no trend against time.

**The test (Grambsch-Therneau, `cox.zph` in R):** correlates the scaled Schoenfeld residuals with a function of time (identity, log or rank). A significant result (small *P*) suggests the predictor's effect changes over time, so PH is violated. It can be run per predictor and globally for the whole model.

**In this chapter:** CoxBoost selects predictors. The coefficients are then used in a multivariate Cox model, the residuals are tested (citing Schoenfeld 1982), and predictors that violate PH are removed from the final model. That is the "Schoenfeld residual filtering" step; Figure 5.1(a) shows the coefficients that survived it.

**Why it matters:** with a PH violation the single hazard ratio is only an average over follow-up, so the model can over- or under-state risk at particular horizons (relevant for 1-, 3- and 5-year predictions). Standard remedies are time-varying coefficients, stratification or a different model.

**Limitations to be ready for:**

- It is a data-driven step after selection. Removing predictors changes the model, so it should be repeated inside each bootstrap resample or acknowledged as a source of optimism. [VERIFY]
- Multiple testing across ~23+ predictors, and a large number of events in the derivation set, means small, clinically unimportant deviations can be significant. Low power in small subgroups has the opposite problem.
- [CLARIFY] Which test did you use (per-predictor or global), which time transform, and which threshold (*P* < 0.05?).
- [CLARIFY] Which genes were removed by the filter, and did removing them change the C-index?

---

## Open points to follow up

1. [CLARIFY] Is a clinical-only (Gleason + PSA) comparison reported anywhere? If not, add it.
2. [CLARIFY] Gleason was the most frequently selected feature in bootstrap resampling (118/200) but was not retained in the original model fit. Be ready to explain this, since it bears on how much the genes add beyond clinical variables.
3. [CLARIFY] Were published signatures refitted in your validation cohort or applied with published coefficients? The text says some were dropped for signs of overfitting to the validation dataset.
4. [CLARIFY] The EMT/plasticity rationale (Q3) is not in the chapter. Add it with citations, and be ready for the SPARC contradiction.
5. [CLARIFY] Heading mismatch: file in `Chapter3/` prints "Chapter 5"; the abstract text references `chp4` supplementary labels. Keep numbering consistent.
6. [CLARIFY] The chapter's methods read a calibration slope >1 as "superior discriminative power". A slope >1 means an under-dispersed prognostic index (here largely due to CoxBoost shrinkage); reword, and use 1 as the benchmark rather than the derivation slope.
7. [CLARIFY] How would a single new patient be scored, given per-dataset centring and scaling? Which median prognostic index defines risk groups in the validation cohort?
8. [CLARIFY] TCGA-PRAD is used for network DE and in the derivation set (Q5). State this explicitly as a limitation, and report the TCGA fold separately.
9. [VERIFY] Is the Schoenfeld filtering step repeated in each bootstrap resample?
10. [CLARIFY] The Discussion says the bootstrap shows "robust selection frequencies"; the top gene is selected in ~52% of resamples. Reword, and report each gene's selection frequency next to its coefficient.
11. [CLARIFY] The text names four genes with elevated random-slope variance but says 18 of 23 are low variance (five not low). Make these agree.
12. [VERIFY] Are the Clone 1/Clone 9 circRNA, miRNA and mRNA data from the same cell-line cultures or RNA extractions? If so, say so, and consider a correlation check across samples.
13. [VERIFY] Check how Denzler et al. (2014) is cited in the Introduction: it is usually cited for quantitative evidence that ceRNA competition needs high site abundance relative to the miRNA.
14. [CLARIFY] Use "putative" or "predicted" for the ceRNA network, and soften the abstract's "lens of regulatory RNA interactions" unless the non-network control (Q2) supports it.
15. [CLARIFY] Table 3: state in the caption and the Methods that the published models were fitted in the validation dataset (apparent performance), so the table cannot rank signatures. Reword the Discussion sentence "moderate predictive power ... compared to previously published signatures".
16. [CLARIFY] Redo the comparison like-for-like: fit each published gene list in the derivation dataset, fix the coefficients, apply to the validation dataset, and report C-index differences with confidence intervals. [VERIFY] How many BCR events are in the validation dataset, and how many predictors per events for the published models?
17. [CLARIFY] External validation has 14 events / 36 patients (Q9): replace "robust" with wording that reflects the weak evidence, and add the event count to the Results.
18. [VERIFY] High-risk HR in validation is 1.48 (95% CI 0.52-2.44) with P = 0.00257; a CI including 1 and a small P value conflict. Check the table. Also the Results text says "year 2" where the table says year 3.
19. [VERIFY] Supplementary Table 3 lists CIT and GSE54460 with the same accession (GSE54460).

---

## Session summary (mock viva, AI examiner)

**Strengths shown:**

- Clear command of the modelling design: why CoxBoost shrinkage inflates the derivation slope; why bootstrap frequencies should not be used to re-select genes; the idea of a clinical-only vs clinical + genomic comparison with a likelihood ratio test.
- Candour about limitations (TCGA double use, ceRNA as hypothesis, published signatures' apparent performance) without being defensive.
- A good biological rationale (pre-existing AR-low/EMT/stemness subpopulation) from the reviewer response.

**Topics to revisit before the viva:**

1. Show what the ceRNA step adds beyond DE-only and random gene sets of the same size (Q1, Q2, Q8).
2. Be able to state what the validation evidence can and cannot support: 14 events, wide intervals, calibration, absolute risk (Q4, Q9).
3. Distinguish three kinds of stability: selection stability (bootstrap), between-study effect heterogeneity (random slopes) and performance heterogeneity (Q6).
4. The ceRNA mechanism is predicted, not demonstrated; know what evidence would be needed (Q7).
5. Put the EMT rationale and the limitations into the chapter text with citations (Q3).

**Unanswered:** Q9 (external validation with 14 events).

**Not covered in this session:** the general questions in the question bank (key findings, original contribution, one-sentence summary, future work, ethics, how this chapter fits the rest of the thesis).
