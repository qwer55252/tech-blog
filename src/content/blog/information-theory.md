---
title: '정보이론 (1)'
description: 'Entropy, Conditional Entropy, Mutual Information, KL Divergence, Cross Entropy에 대한 공부 기록.'
pubDate: '2026-11-07'
tags: ['Information Theory', 'Learning']
draft: false
---

<details open>
<summary>1. Entropy - “얼마나 불확실한가?”</summary>


- 확률 변수 $X$의 결과를 보기 전에 내가 얼마나 불확실한가?를 측정
  $$
  H(X) = -\sum_x p(x) \log p(x)
  $$

  - uniform distribution에서는 모든 카테고리의 확률이 똑같은데, 이 경우는 불확실성이 크게 측정됨
  - 반대로 one-hot categorical distribution(ex: 100% 앞면)에서는 $H(X) = 0$으로 측정됨
- 헷갈릴 수 있는게 정보량이랑은 다른 개념임
  - 엔트로피의 정확한 정의는 “평균적인 불확실성”임
  - 확률 변수 $X$의 특정 사건 $x$의 정보량은 $I(x) = - \log p(x)$로 정의하는데, 확률값이 작을수록 정보량은 높게 측정됨
  - 예를 들어, “내일 해가 뜬다”는 확실한 사건이기에 정보량이 없음. 반대로 “내일 서울에 운석이 떨어진다”는 매우 희귀한 사건이므로 정보량이 큼.
  - 엔트로피는 이 정보량의 평균값이라고 보면 됨
</details>

<details open>
<summary>2. Conditional Entropy - “다른 정보를 알고도 얼마나 불확실한가?”</summary>


- 확률 변수 $X$를 이미 알고 있을 때에도 확률 변수 $Y$에 대해 얼마나 불확실한가?를 측정
  $$
  H(Y |X)= \sum _x P(x) H(Y |X=x)
  $$
- 이때, $H(Y|X=x)$는 다음과 같이 정의되고,
  $$
  H(Y|X=x) = -\sum_y P(y|x) \log P(y|x)
  $$
- 따라서, 다음과 같이 다시 쓸 수 있다.
  $$
  H(Y|X) = -\sum_x \sum_y P(x,y) \log P(y|x)
  $$
- 쉽게 말해서, “각 $X=x$ 상황에서의 $Y$의 엔트로피를 구한 뒤, 그걸 $P(X=x)$로 평균낸 것”이다.
</details>

<details open>
<summary>3. Mutual Information</summary>


- $X$가 $Y$에 대해 얼마나 많은 정보를 주는가?를 측정

$$
I(X;Y) = H(Y) - H(Y |X)
$$

- “$X$를 알기 전 $Y$의 불확실성”에서 “$X$를 알고 난 후 $Y$의 불활실성”을 뺀다고 보면 된다.
- $X$와 $Y$의 관계가 <mark>독립적일수록</mark> $H(Y|X)$의 값이 $H(Y)$와 같으므로, 독립적이면 <mark>0에 가깝다.</mark>
</details>

<details open>
<summary>4. KL Divergence - “두 확률분포가 얼마나 다른가?”</summary>


- 두 확률 분포가 얼마나 다른지를 측정
  $$
  D_{KL} (P||Q) = \sum_x P(x) \log {P(x) \over Q(x)}
  $$
- 조금 더 정확하게 표현하자면, <b>“</b><b>$P$</b><b>에서 자주 일어나는 사건들에 대해 </b><b>$Q$</b><b>가 얼마나 잘못된 확률을 주는지에 대한 평균”</b>이다.
  - $- \log Q(x) - [- \log P(x)]$ 가 $Q$의 정보량에서 $P$의 정보량을 뺀 것이다.
  - 만약 $Q$와 $P$가 같다면 차이가 0이므로 KL Divergence 값이 0이 될거다.
- 최종적으로, 이 차이를 모든 사건 $x$에 대해 marginalization 한 것이 $D_{KL}(P||Q)$ 이다.
- KL Divergence는 대칭적이지 않다.
  $$
  D_{KL}(P||Q) \ne D_{KL}(Q||P)
  $$

  - $D_{KL}(P||Q)$는 $P$에서 샘플을 뽑지만, $D_{KL}(Q||K)$는 $Q$에서 샘플을 뽑는다.
  - $P$와 $Q$의 분포 자체가 다르므로 대칭을 이룰 수 없다.
</details>

<details open>
<summary>5. Cross Entropy - “정답 분포를 기준으로 예측을 얼마나 잘했는가?”</summary>


- 정답 분포를 기준으로 얼마나 예측을 잘 했는지 측정
  $$
  H(P,Q) = - \sum_x P(x) \log Q(x)
  $$

  - 좀 더 구체적으로 말하면, “실제 분포 $P$에서 데이터가 나온다고 할 때, 내가 $Q$라는 분포를 믿고 예측하면 평균적으로 얼마나 큰 정보 비용을 치르는가?”를 의미한다.
  - $P(x)$: 실제 정답 분포
  - $Q(x)$: 모델이 예측한 분포
  - $- \log Q(x)$: 모델이 사건 $x$에 대해 지불하는 정보 비용

  $$
  H(P,Q) = E_{x \sim P} [- \log Q(x)]
  $$

  - 이렇게 표현할 수도 있다.
- 확률 값이 낮을수록 엄청난 페널티를 받는다.
  - 정보량 $I(x) = - \log P(x)$로 정의된다.
  - 확률값이 작을수록 정보량은 커진다.
    - $- \log 0.9$ \<\< $- \log 0.001$
  - 따라서 실제 정답은 $P$에서는 일어난 사건 $x$가 $Q$에서는 일어나지 않는 경우 Cross Entropy 값은 매우 커진다.
- Cross-Entropy와 KL의 관계
  $$
  H(P,Q) = H(P) + D_{KL}(P||Q)
  $$

  - Cross-Entropy = <code>실제 데이터 자체의 entropy</code> - <code>모델이 틀려서 생기는 추가 비용</code>
  - target distribution $P$가 고정된 경우 <mark>$H(P)$</mark><mark>는 상수취급</mark>되므로, Cross-Entropy를 낮추는 것은 KL divergence를 최소화 하는 것과 같은 의미이다.
</details>

