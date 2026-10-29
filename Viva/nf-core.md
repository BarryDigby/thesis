# Mock viva notes: nf-core/circrna chapter

Source: `Chapter2/main.tex` (printed in the thesis as **Chapter 3**; the folder number does not match the heading).
Published as: Digby, Finn and Ó Broin, BMC Bioinformatics 24(1), 2023.

Tags used below:

- **[VERIFY]** a fact I could not confirm from the chapter; check your scripts, notes or the source paper.
- **[CITE]** a claim that needs a reference.
- **[CLARIFY]** an ambiguity in the chapter or in your answer to resolve before the viva.

Table and figure numbers follow the chapter's numbering (Table 3.1 = workflow comparison, 3.2 = run information, 3.3 = tool performance, 3.4 = top combinations; Figure 3.2 = *C. elegans* comparison, 3.3 = module outputs, 3.4 = computational performance, 3.6 = parameter selection).

---

## Checklist before the viva

**Chapter text to fix or be ready to explain**

1. **Combinatorics formula and counts.** The chapter writes nCk = n!/(n-k)! with n = 6, k = 1...6, giving 126 sets. The formula given is the permutation formula (the combination formula is n!/(k!(n-k)!)). With n = 6 the number of non-empty subsets is 63, not 126. 126 equals the sum of C(7,k) for k = 1...6, which matches seven tools and sets of size 1 to 6. [CLARIFY] what was actually run (seven tools or six, and which set sizes), then correct the text.
2. **BSJ threshold wording.** The simulation text says "at least 2 reads" (>= 2). Use ">= 2" consistently, and do not write ">2" or the symbol "≽".
3. **Dependency count.** The chapter lists three dependencies: Java (>= 8), Nextflow and a container client (Docker or Apptainer). Do not say "two".
4. **Background set.** The chapter does not describe a separate injected noise set. [CLARIFY] what the 1,450,328 reads contain, how the background was generated, and how calls on background circRNAs are scored.
5. **Match rule.** [CLARIFY] whether a true positive needed an exact BSJ coordinate match, an overlap, and/or strand agreement. Your answers used both "compare coordinates" and "overlap and match strand".
6. **Memory figures.** The computational-cost text quotes 38.26 GB (find_circ alignment) and 37.37 GB (CIRIquant alignment) on PRJNA742881, while Table 3.3 (simulation) lists 3 GB and 65 GB. Be ready to say these are different datasets and process-level versus whole-tool measurements. DCC used 21 GB on the simulation but failed at 120 GB on the real data; the chapter attributes this to very high coverage in the RNase R dataset.
7. **BSJ threshold in the demonstration.** Figure 3.2 uses at least 15 BSJ reads (CIRIquant), versus >= 2 in the simulation. State that this matched Cao et al. (your explanation), and add that explicitly to the text.
8. **Genre statement.** If the paper was published as a software or application-note article type, say so in the thesis text. [VERIFY] the journal's article category.

**Citations to add or confirm**

- The >= 2 BSJ read convention and the claim that single-read support gives many false positives. [CITE]
- Claims about circRNAwrap (number of bundled tools, Python 2.7/3 mix) and circtools (wrapper for DCC). [CITE] / [VERIFY]
- The nf-core precedent for keeping long-read workflows separate (for example RNA-seq). [CITE]
- Spliced-leader trans-splicing and RT template switching as circRNA-calling artefacts (general background, not in the chapter). [CITE]
- Evidence on how widely circRNAs act as miRNA sponges. [CITE]

---

## Q1. Evaluation design

**Question.** Your performance evaluation uses a simulated glioblastoma dataset and treats every call that is not a true positive as a false positive. How do you justify that evaluation design for comparing circRNA quantification tools?

**Prompted by.** Quantification tool performance section; Table 3.3.

**Suggested answer (tidied).**

> The aim was a controlled comparison of the seven tools against known ground truth, which real RNA-seq data cannot provide because the true circRNA set is unknown.
>
> I simulated 1,450,328 paired-end reads (101 bp, 350 bp insert) with a modified CIRIsimulator. I downloaded 7,445 glioblastoma circRNAs from circRNADb, formatted them to CircBase specifications, and 7,267 were successfully simulated. Those 7,267 are the true-positive set. The rest of the simulated data acts as background **[CLARIFY]**.
>
> A call was a true positive if it matched one of the 7,267 simulated circRNAs on **[CLARIFY: exact BSJ coordinates / overlap / strand]**. Every other call was a false positive. This is defensible because truth is known by construction, and applying the same rule to every tool keeps the comparison fair.
>
> There are no true negatives. Quantification tools perform a retrieval task: they return a set of circRNAs from reads rather than classifying a predefined set of candidates, so there is no defined universe of negatives to count. Even if I defined one, such as every possible junction pair, it would be vast and arbitrary and would push specificity towards 1 for every tool. Accuracy, specificity and ROC-style measures are therefore not meaningful. I report precision, sensitivity and F1, which depend only on what a tool returns and what is truly present.
>
> - Precision = TP / (TP + FP) = true positives / circRNAs detected.
> - Sensitivity = TP / (TP + FN) = true positives / 7,267.
> - F1 = 2 x (precision x sensitivity) / (precision + sensitivity), the harmonic mean, which penalises imbalance so that both must be high.
>
> Worked example, CIRCexplorer2: precision 6259/6270 = 99.82%; sensitivity 6259/7267 = 86.13%; F1 = 2(0.9982)(0.8613)/(0.9982 + 0.8613) = 92.47%.
>
> I required >= 2 BSJ reads per call, a common convention **[CITE]**, because single-read support is a major source of false positives. The table therefore describes each tool together with that filter, not raw tool output.
>
> Calling circRNAs found by at least two tools (`--tool_filter 2`) gave 99.83% precision, 96.12% sensitivity and 97.94% F1. I did not add this to the table as a row labelled nf-core/circrna because reviewers advised that the simulation was intended to evaluate individual tools.

**Limitations to state.**

- The strict definition counts a correct call with slightly shifted coordinates as a false positive. This applies equally to all tools, so rankings are reliable and absolute precision is conservative.
- The truth set comes from circRNADb, a database of computationally predicted circRNAs, so some entries may be false and some tools may be favoured. [VERIFY wording]
- The simulation does not reproduce RNase R degradation bias (RNase R is a 3'-5' exonuclease; incomplete digestion and degradation of some circRNAs are the concerns), RT template-switching artefacts, or repeat/paralog mapping artefacts. Avoid the non-standard term "decoy sequences" unless you define it.
- One tissue (human glioblastoma), one read length and one coverage level.
- The tool-selection decisions for the *C. elegans* run were based on a human simulation.
- 178 of the 7,445 circRNAs were not generated. [CLARIFY] why (simulator constraints).

**Corrections to earlier drafts.**

- It is "no true negatives", not "no true false negatives" (false negatives exist: true circRNAs a tool misses).
- Precision is not specificity. Specificity is TN / (TN + FP) and cannot be computed here.
- The F1 formula uses precision, not TP.

---

## Q2. The 2,420 additional circRNAs in *C. elegans*

**Question.** In the PRJNA742881 demonstration, nf-core/circrna reported 2,420 circRNAs not in the published study. There is no ground truth, and your BSJ threshold (>= 15 reads for CIRIquant) differs from the simulation's. How do you know those additional circRNAs are real?

**Prompted by.** Results and discussion, Figure 3.2.

**Your answer (tidied).**

> I don't know, and the chapter does not claim they are validated. The >= 15 BSJ read threshold was chosen to match Cao et al. so the comparison was like for like. I treat the additional circRNAs as candidates for experimental follow-up. The purpose of the demonstration is to show that a single execution of the workflow recovers the published set (4,435 shared) and returns further candidates.

**Points to add.**

- A high BSJ read count shows read support, not circularity. RT template switching, repeat or paralog mapping errors and trans-splicing (widespread in *C. elegans* via spliced-leader trans-splicing, **[CITE]**) can also generate junction-spanning reads. In a very high-coverage, RNase R-enriched dataset (the chapter calls it RPAD), 15 reads is a lower bar than it sounds.
- "More candidates" is not a success measure. DCC detected the most circRNAs in the simulation (8,397) and had the worst precision (75.55%).
- Avoid "putative biomarkers". Use "candidates for experimental validation" (for example divergent-primer RT-PCR, RNase R resistance, Sanger sequencing of the junction).
- The 521 circRNAs unique to the published study: be ready to explain what they say about your sensitivity, given that you omitted CIRI2 and DCC.

**Evidence you could offer.**

- External: cross-reference coordinates with *C. elegans* circRNA databases. Say that a hit shows reproducibility, not validity, because many databases come from the same tools, and a miss does not make a call false. Plan for a liftover step if the database genome build differs from WBcel235. [VERIFY databases and builds]
- Internal (from your own data): how many of the 2,420 were called by more than one of the four tools; reproducibility across the six samples; and the annotation class assigned by your script (for example intergenic calls are less reliable).
- Your earlier idea of discarding candidates that overlap gene-fusion sites is weaker. Fusion catalogues for *C. elegans* are sparse, and trans-splicing and template switching are the more relevant artefact classes.

---

## Q3. Evaluation of the differential expression module

**Question.** Figure 3.3 shows differential expression outputs, but the chapter reports no evaluation of that module comparable to the simulation. How have you evaluated whether the differential expression results are correct?

**Prompted by.** Differential expression analysis section; Figure 3.3.

**Your answer (tidied).**

> Figure 3.3 is intended to show the plots and outputs the workflow produces. It is not a validation. The chapter showcases the workflow, how it works and what it outputs, then evaluates the constituent quantification tools to guide first-time users on sensible filtering parameters.

**Points to add.**

- State the scope explicitly. The abstract promises three modules and "robust filtering", but the only quantitative evaluation covers the quantification tools.
- The module wraps established methods (DESeq2, CircTest), whose validation is in their own papers. Your contribution is integration and automation, not new statistics.
- Components without formal evaluation: the miRNA prediction module, the annotation script and the use of linear gene library-size factors to normalise circRNA counts (an unusual choice). Be ready to explain the reasoning, for example that circRNA counts are sparse and low, which makes standard size-factor estimation from them alone unstable. [VERIFY that this was your reason]
- The guidance rests on one simulated human dataset; say so.

---

## Q4. The 200 bp parameter in the annotation script

**Question.** A candidate whose start and end are within 200 bp of exon boundaries is called a circRNA, and one outside that range an exon-intron circRNA. How was 200 bp chosen, and how do you know the script's classifications are correct?

**Prompted by.** circRNA discovery section (in-house annotation script).

**Your answer (tidied).**

> The 200 bp default was a pragmatic heuristic, not an empirically optimised value, and I did not formally evaluate the classification. I exposed it as `--exon_boundary` so users can tune it for their annotation and organism.

**Points to add.**

- A configurable parameter lets users change the answer but does not show any value is correct.
- Downstream effect: the script outputs the mature spliced sequence used by the miRNA module. A candidate within 200 bp of, but not on, an exon boundary and called an exonic circRNA could have a mature sequence that is off by up to that distance. Quantify or discuss that effect.
- Edge case: the chapter says "< 200 bp" and "> 200 bp". What happens at exactly 200?
- A concrete next step: use the simulated circRNAs (known structure; [VERIFY] whether they are exonic by construction) to test classification accuracy and sweep the threshold.

---

## Q5. Originality relative to existing workflows

**Question.** Table 3.1 lists nine existing workflows. What is original about this work, and what does nf-core/circrna do that none of them does?

**Prompted by.** Introduction, Table 3.1.

**Your answer (tidied).**

> Of the nine workflows surveyed, nf-core/circrna is the only one that performs circRNA quantification, miRNA target prediction and differential expression analysis in one workflow. Several tools that provide miRNA prediction or differential expression require users to run quantification manually and to install the quantification tools themselves, which is difficult in practice. circRNAwrap requires a dedicated environment for its bundled tools **[VERIFY: number of tools and the Python 2.7/3 mix; CITE]**. circtools wraps DCC and therefore does not provide multi-tool quantification **[VERIFY; CITE]**. CirComPara is the closest because it is also containerised, but it has no miRNA module and no circRNA differential expression **(your Table 3.1 shows linear-RNA differential expression only)**.

**Points to add.**

- Bound the claim: "of the nine workflows surveyed, as of the time of publication". Avoid an unqualified "the only".
- Integration alone is a thin basis for originality. Also name: consensus calling across up to seven tools (`--tool_filter`), the in-house annotation script, the simulation-based guidance (three tools with `--tool_filter 2`), and the nf-core benefits (portability across laptop, HPC and cloud, documentation, maintenance).

---

## Q6. The knowledge contribution

**Question.** You have described an engineering contribution. What is the contribution to knowledge, and what do we know after reading the chapter that we did not know before?

**Your response (tidied).**

> This is an application note, so novel scientific discovery is not the aim. **[VERIFY the journal's article type and state it explicitly in the thesis.]**

**Points to add.** The examiner assesses the thesis, so state the contribution in terms of knowledge and practice:

> The contribution is practical and methodological. It is the first workflow to combine quantification, miRNA prediction and differential expression with containerised portability, plus an empirical benchmark that turns tool and filter choice into evidence-based defaults.

Empirical findings you can name (each with the single-simulated-dataset caveat):

- Benchmark of seven tools: CIRCexplorer2, CIRIquant, find_circ and MapSplice had the highest F1 scores among the tools (> 91%).
- Consensus calling (>= 2 tools) gave 99.83% precision, 96.12% sensitivity and 97.94% F1.
- Three tools with `--tool_filter 2` is the inflection point; more tools gave minimal gains and stricter filtering reduced sensitivity.
- Sets including DCC performed significantly worse; you attribute this to DCC's use of STAR 2-pass mode raising sensitivity at the cost of false positives **[CITE]**.

---

## Q7. "Reduces the barrier to entry"

**Question.** The abstract claims the workflow reduces the barrier to entry. The chapter supports this with statements such as "setting up the analysis required minimal effort". What evidence do you have that it is easier to use or install than the alternatives?

**Your answer (tidied).**

> A user could install seven separate environments and write a script to run each tool sequentially, but that script would not account for each tool's resource needs, parallel execution to reduce wall time, or failure and retry handling. nf-core/circrna is containerised, so users need no environment creation. They need Java, Nextflow and a container client (Docker or Apptainer) on their system, which is minimal for what the workflow achieves.

**Points to add.**

- Use three dependencies, not two (see checklist).
- Drop the point about AI coding agents. Say instead that writing resource-aware, fault-tolerant distributed execution was a substantial engineering task at the time.
- The bash-script comparison is a straw man. The real comparator is CirComPara, which is also containerised. The advantage over it is the added modules plus Nextflow-level scheduling and portability.
- Evidence from the chapter: peak memory varies widely across tools (about 3 GB for find_circ to 65 GB for CIRIquant in Table 3.3), which supports resource-aware scheduling. Table 3.2 gives 18 h 21 m run time against 1,566 CPU hours, which supports a parallelism argument. Compare against a sequential estimate with a caveat, because CPU hours are not the same as sequential wall time for multi-threaded tools.
- Be honest that this is a design argument, not a user study.

---

## Q8. How long-term is the contribution?

**Question.** The chapter promises pinned versions for reproducibility and continued maintenance. How long-term is this contribution, given tool updates and developments such as long-read sequencing?

**Your answer (tidied).**

> Nextflow workflows are composed of modules. Popular modules (FastQC, STAR, BWA-MEM and so on) are maintained by nf-core and versioned with the software release, and maintainers are expected to update to the latest release unless there is a strong argument against it. Custom modules, such as my annotation script, are maintained by the workflow authors. Long-read circRNA detection is being developed as a separate nf-core workflow because it uses a different read type, as happened with long-read RNA-seq **[CITE]**.

**Points to add.**

- Say what the policy is when a bundled tool is abandoned or superseded, and when a new quantification tool is added.
- Reproducibility versus updating: your benchmark used specific tool versions. Say whether you would re-run it after major updates.
- The annotation script is yours to maintain: say who maintains it and how it is tested.
- State in the chapter that input is paired-end short-read data and that long-read detection is out of scope.

---

## Q9. miRNA sponge assumption

**Question.** The miRNA module assumes circRNAs act as miRNA sponges, and your introduction supports this with the ceRNA hypothesis. How strong is the evidence that circRNAs generally function this way, and how should users interpret the module's predictions?

**Prompted by.** Introduction (circCCDC66 example, ceRNA network) and miRNA prediction section.

**Your answer (tidied).**

> The module predicts miRNA response element (MRE) sites within the mature spliced circRNA sequence by matching the miRNA seed region against that sequence. These are predicted interactions, not demonstrated ones.
>
> Predictions come from two tools. TargetScan reports seed-matched sites of type 8mer, 7mer-m8, 7mer-A1 and 6mer. miRanda scores sequence complementarity and then estimates duplex thermodynamic stability using the ViennaRNA package **[VERIFY against the miRanda paper]**. A candidate must be called by both tools. We recommend a post-hoc filter that removes 6mer sites and predictions with a minimum free energy (MFE) weaker than -20 kcal/mol (that is, MFE >= -20), which the miRanda authors suggest as a strict cut-off **[CITE]**.
>
> 6mer sites are treated with caution because conservation analyses of mammalian mRNAs found 7mer and 8mer sites are selectively preserved, while 6mer sites show weaker conservation **[VERIFY wording; CITE: Friedman et al., Genome Research 2009]**.
>
> The module was not formally evaluated in the chapter. TargetScan and miRanda are long-established tools (both published in 2003 **[CITE]**), and no ground truth exists at scale, so precision, sensitivity and F1 were not computed. This is a limitation.
>
> Experimental follow-up for any prediction could include AGO2 RNA immunoprecipitation, to test whether the circRNA and the miRNA co-occur in the RISC complex, and reporter assays with the putative site mutated.

**Corrections to your draft.**

- A dual-luciferase assay does not measure miRNA content. A reporter carrying the putative site is repressed by the miRNA, and mutating the site restores the signal. That shows the site is targetable. Showing that the circRNA itself sponges the miRNA needs a design in which the circRNA relieves the repression. AGO2 RIP shows co-occurrence in the RISC complex, not direct binding; AGO CLIP or miRNA pull-down gives stronger evidence. [VERIFY]
- You said no filtering is enforced, but the chapter says target miRNAs must be called by both algorithms. That intersection is an enforced filter. Both tools rely on seed complementarity, so their errors are correlated and agreement adds less confidence than it appears to.
- MFE values are negative. State the cut-off direction explicitly (remove MFE >= -20).
- "The miRNA spends the vast majority of its time in the MFE shape" overstates it. The MFE structure is one structure, not the ensemble. A free-solution duplex energy is also a poor proxy for Argonaute-mediated targeting, which is seed-driven.
- Do not describe miRanda as scoring complementarity "and not alignment". As I understand it, it uses a dynamic-programming alignment weighted by complementarity, then an energy estimate. [VERIFY]
- The conservation analysis concerned mammalian mRNA 3' UTRs. Applying its logic to circRNA sequences is an extrapolation. [CLARIFY] whether the module reports conservation for circRNA sites at all.
- "Published in the early 2000s, so familiar" is not validation; both tools are known for high false-positive rates.
- "Predicted interactions, so no precision or sensitivity" is a weak defence. A feasible sanity check would use a well-known positive control such as CDR1as with miR-7 (cited in the chapter as Hansen et al. 2013) to see whether the module recovers it. [VERIFY]

**Still to answer (the first half of the question).** How strong is the evidence that circRNAs *generally* act as miRNA sponges, beyond well-known examples such as CDR1as and circCCDC66? Points to prepare:

- What the cited evidence shows (conserved MREs and specific examples) versus what it does not show (a general sponge function for most circRNAs). Some genome-wide analyses report that most circRNAs are not enriched for binding sites of any single miRNA. [CITE, VERIFY]
- What this means for how much weight a user should give the module's output: it generates hypotheses for follow-up, not evidence of function.

---

## Where we stopped

Q9 is partly answered: the module description is done; the evidence for a general sponge function is still open. Remaining bank questions worth preparing for this chapter: "What are the weakest and strongest parts of your work?", "What would you do differently?", and "Who are your envisioned users?".