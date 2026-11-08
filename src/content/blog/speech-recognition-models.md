---
title: '음성인식 모델 정리'
description: 'CTC, AED, RNN-T와 wav2vec 2.0, HuBERT에 대한 공부 기록.'
pubDate: '2026-11-08'
tags: ['Speech', 'ASR', 'Learning']
draft: false
---


# 1. E2E ASR - AED, CTC, RNN-T

## 1-a. CTC(Connectionist Temporald Classification)

- 모델 구조
  - Sotmax 뒷단에 loss 형태로 붙음
    <img src="/tech-blog/images/speech-recognition-models/ctc-architecture.png" alt="ctc-architecture" loading="lazy" />
- 학습 방법
  - text 형태의 정답 transcript와 frame-level의 음성 신호는 길이가 다르고, 각 토큰이 어느 프레임에 대응하는지 알 수 없다.
  - 그래서 하나의 정답 transcript에 대응하는 여러 alignment($\pi$)가 존재한다.
  - CTC에서는 <b>연속된 중복 토큰을 병합하고 blank를 제거($B$)</b>했을 때 정답 transcript가 되는 모든 alignment의 확률을 더한다.
  - 이 확률에 음의 로그를 취한 값을 loss로 사용한다.
    $$
    \mathcal L_{\mathrm{CTC}}
    =-\log\sum_{\pi:B(\pi)=y}P(\pi\mid x)
    $$
  - 이를 통해 transcript는 있지만 frame-level alignment는 모르는 상황에서 학습할 수 있게 해준다.
- 특징
  - CTC는 확률을 계산하는 과정에서 모든 프레임의 확률이 조건부 독립이라고 가정한다.

    - 하나의 alignment 확률을 만들기 위해서 모든 프레임의 확률을 곱해서 해당 경로의 확률을 만든다.
    - 인코더는 주변 음성 context를 활용할 수 있지만, CTC 출력층은 이전 출력 토큰을 직접 조건으로 사용하지 못한다.
    - 따라서 출력 토큰 사이의 언어적 관계를 직접 모델링하는 데 제약이 있다.
    - 이때문에 동음이의어를 출력하는 오류가 발생한다.
    - 외부 LM으로 이를 보완할 수 있다.
  - 구조가 단순하다.
  - <b><mark>alignment가 구조적으로 monotonic 하다.</mark></b>
  - 동일 토큰을 연속으로 출력하려면 사이에 blank가 필요하다.

## 1-b. AED(Attention-based Encoder Decoder)

...

## 1-c. RNN-T

- 모델 구조
  <img src="/tech-blog/images/speech-recognition-models/rnnt-architecture.png" alt="rnnt-architecture" loading="lazy" width="500" />

  - <b>Encoder</b>
    - 음성을 입력받아 시간별 음성 표현을 만든다.
      $$
      (h_1, \dots , h_T) = Encoder (x)
      $$
  - <b>Prediction Network</b>
    - 지금까지 출력한 토큰들($y_1, \dots y_u$)을 입력받아 출력 정보를 압축한 표현($g_u$)을 만든다.
      $$
      g_u=\mathrm{PredictionNetwork}(\langle s\rangle,y_1,\ldots,y_u)
      $$

      - $g_0$는 시작 토큰 $\langle s\rangle$과 초기 상태로 계산한다.
    - 학습할 때는 정답 토큰을, 추론할 때는 이전 예측 토큰들(blank 제외)을 입력한다.
  - <b>Joint Network</b>
    - 음성 표현 $h_t$와 출력 이력 표현 $g_u$를 결합해 다음 토큰 + blank의 확률분포를 만든다.
    - 간단한 구현 예제 식은 다음과 같다.

    $$
        z_{t,u}
    =
    \tanh\left(W_hh_t+W_gg_u+b_{\mathrm{joint}}\right)
    $$

    - 결합한 표현을 토큰과 blank에 대한 logit으로 변환한다.
      $$
      \ell_{t,u}=W_{\mathrm{out}}z_{t,u}+b_{\mathrm{out}}
      $$
    - Softmax를 적용해 최종 확률 분포를 만든다.
      $$

      P(k\mid h_t,g_u)
      =
      \frac{\exp(\ell_{t,u,k})}
      {\displaystyle\sum_{k'\in\mathcal V\cup\{\varnothing\}}
      \exp(\ell_{t,u,k'})}

      $$

      - $\mathcal V$: 출력 토큰 집합, $\varnothing $: blank
- 학습 방법
  - CTC와 마찬가지로 frame-level alignment가 필요하지 않다.
  - “음성 위치 $t$ x 출력 위치 $u$”로 이루어진 정렬 격자에서 가능한 경로를 고려한다.
    - 각 위치에서는 두 가지 이동이 가능하다.
    - Blank 출력: 음성 위치를 다음 시점으로 이동한다. $(t, u) \rarr (t+1, u)$
    - 토큰 출력: 음성 위치를 유지하고 출력 이력을 갱신한다. $(t, u) \rarr (t, u+1)$
  - 정답 transcript를 만드는 모든 유효 alignment의 확률을 합하고, 음의 로그를 loss로 사용한다.
    $$
    \mathcal L_{\mathrm{RNN-T}}
    =-\log\sum_{\pi\in\mathcal A(y)}P(\pi\mid x)
    $$

    - 여기서 이 합은 동적 계획법으로 계산한다.
    - CTC와 달리 반복 토큰을 병합하지 않는다. 경로에서 blank를 제거하면 출력 토큰열이 된다.
- 특징
  - 이전 출력 토큰에 의존해 다음 토큰을 예측한다.
    - CTC과 다르게 frame 간의 조건부 독립을 가정하지 않는다.
  - CTC와 마찬가지로 Alignment가 monotonic 하다.
    - 음성 위치와 출력 위치가 앞으로만 이동한다.
  - 하나의 음성 시점에서 여러 토큰을 출력할 수 있다.
    - 토큰을 출력하면 음성 위치는 그대로이기 때문에, blank 출력 없이 연속해서 토큰을 출력하면 한 음성 시점에 여러 토큰을 출력할 수도  있다.
  - Streaming ASR에 적합하다.
    - 다만 RNN-T loss 만으로 streaming이 보장되지는 않는다.
    - Encoder도 미래 음성을 제한적으로 참조하도록 설계해야 한다.
    - 원 논문에서는 양방향 인코더를 사용했지만, 단방향 인코더를 사용하거나 미래 음성을 제한하는 별도의 청크 처리가 필요하다.

# 2. SSL 모델 - wav2vec 2.0, HuBERT

<details open>
<summary>1. wav2vec 2.0</summary>

<img src="/tech-blog/images/speech-recognition-models/wav2vec2-overview.png" alt="wav2vec2-overview" loading="lazy" />

<img src="/tech-blog/images/speech-recognition-models/wav2vec2-detail.png" alt="wav2vec2-detail" loading="lazy" />
</details>

<details open>
<summary>2. HuBERT</summary>

<div style="display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-start;">
<div style="flex: 1 1 260px; min-width: 0;">
<img src="/tech-blog/images/speech-recognition-models/hubert-overview.png" alt="hubert-overview" loading="lazy" />
</div>
<div style="flex: 1 1 260px; min-width: 0;">
<img src="/tech-blog/images/speech-recognition-models/hubert-detail.png" alt="hubert-detail" loading="lazy" />
</div>
</div>

- 음성에서 pseudo-label을 만든 다음 BERT처럼 masked prediction을 한다.
</details>
