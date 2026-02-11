import config from "@/config";
import ButtonCheckout from "./ButtonCheckout";

const SpinDeckPricing = () => {
  // Get main subscription plans (not addons)
  const subscriptionPlans = config.stripe.plans.filter(plan => !plan.isAddon && !plan.isOneTime);
  const lifetimePlans = config.stripe.plans.filter(plan => plan.isOneTime && !plan.isAddon);
  const addonPlans = config.stripe.plans.filter(plan => plan.isAddon);

  // Calculate savings for one-time plans
  const calculateSavings = (plan) => {
    if (!plan.isOneTime || !plan.priceAnchor) return null;
    const basicPlan = config.stripe.plans.find(p => p.name === "Basic");
    if (!basicPlan) return null;
    
    const months = Math.floor(plan.priceAnchor / basicPlan.price);
    const savings = Math.round(plan.priceAnchor - plan.price);
    return { months, savings };
  };

  return (
    <section className="bg-black overflow-hidden" id="pricing">
      <div className="py-24 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col text-center w-full mb-20">
          <p className="font-medium text-spindeck-red mb-4 text-lg">PRICING PLANS</p>
          <h2 className="font-bold text-4xl lg:text-6xl tracking-tight mb-4">
            Choose Your <span className="text-spindeck-red">Path to Success</span>
          </h2>
          <p className="text-xl text-spindeck-gray max-w-2xl mx-auto">
            From emerging artists to established labels across all genres, we have a plan that fits your needs
          </p>
        </div>

        {/* Monthly Subscription */}
        {subscriptionPlans.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Monthly Subscription</h3>
              <p className="text-spindeck-gray">Start your journey with flexible monthly billing</p>
            </div>
            <div className="max-w-md mx-auto">
              {subscriptionPlans.map((plan) => (
                <div 
                  key={plan.priceId} 
                  className="bg-spindeck-dark rounded-lg p-8 border-2 border-gray-700 hover:border-spindeck-red/50 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                      <p className="text-spindeck-gray text-sm">{plan.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold">${plan.price}</div>
                      <div className="text-spindeck-gray text-sm">/month</div>
                    </div>
                  </div>

                  <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-full mb-6">
                    MONTHLY SUBSCRIPTION
                  </div>

                  {plan.features && (
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <svg 
                            className="w-5 h-5 text-spindeck-red shrink-0 mt-0.5" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M5 13l4 4L19 7" 
                            />
                          </svg>
                          <span className="text-sm">{feature.name}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <ButtonCheckout 
                    priceId={plan.priceId}
                    mode="subscription"
                    text="Start Monthly Plan"
                    className="w-full py-3 rounded font-semibold bg-transparent border border-spindeck-gray hover:bg-spindeck-red hover:border-spindeck-red hover:text-white transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lifetime Access Plans */}
        {lifetimePlans.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Lifetime Access Plans</h3>
              <p className="text-spindeck-gray">Pay once, use forever — No recurring fees!</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {lifetimePlans.map((plan) => {
                const savingsInfo = calculateSavings(plan);
                
                return (
                  <div 
                    key={plan.priceId} 
                    className={`relative ${plan.isFeatured ? 'lg:scale-105 z-10' : ''}`}
                  >
                    {plan.isFeatured && (
                      <div className="absolute -top-5 left-0 right-0 mx-auto w-fit">
                        <span className="bg-spindeck-red text-white text-xs font-bold px-4 py-2 rounded-full uppercase">
                          Best Value
                        </span>
                      </div>
                    )}

                    <div 
                      className={`
                        h-full bg-spindeck-dark rounded-lg p-6 border-2 transition-all duration-300
                        ${plan.isFeatured 
                          ? 'border-spindeck-red shadow-xl shadow-spindeck-red/20' 
                          : 'border-transparent hover:border-spindeck-red/50'
                        }
                      `}
                    >
                      {/* Lifetime Badge */}
                      <div className="inline-block px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 text-xs font-bold rounded-full mb-4 border border-yellow-500/30">
                        ⭐ LIFETIME ACCESS
                      </div>

                      <div className="mb-6">
                        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                        <p className="text-spindeck-gray text-sm">{plan.description}</p>
                      </div>

                      <div className="mb-6">
                        <div className="flex items-baseline gap-2">
                          <span className="text-5xl font-bold">
                            ${plan.price}
                          </span>
                          <span className="text-spindeck-gray">one-time</span>
                        </div>
                        {savingsInfo && (
                          <p className="text-green-400 text-sm mt-2 font-medium">
                            💰 Save ${savingsInfo.savings} vs {savingsInfo.months} months of Basic!
                          </p>
                        )}
                      </div>

                      {plan.features && (
                        <ul className="space-y-3 mb-8">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <svg 
                                className={`w-5 h-5 shrink-0 mt-0.5 ${feature.highlight ? 'text-yellow-400' : 'text-spindeck-red'}`}
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={2} 
                                  d="M5 13l4 4L19 7" 
                                />
                              </svg>
                              <span className={`text-sm ${feature.highlight ? 'text-yellow-400 font-semibold' : ''}`}>
                                {feature.name}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}

                      <ButtonCheckout 
                        priceId={plan.priceId}
                        mode="payment"
                        text="Get Lifetime Access"
                        className={`
                          w-full py-3 rounded font-semibold transition-all duration-300
                          ${plan.isFeatured 
                            ? 'bg-spindeck-red hover:bg-red-600 text-white' 
                            : 'bg-transparent border border-spindeck-gray hover:bg-spindeck-red hover:border-spindeck-red hover:text-white'
                          }
                        `}
                      />

                      <p className="text-center text-xs text-spindeck-gray mt-4">
                        Pay once, use forever
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Add-on Plans */}
        {addonPlans.length > 0 && (
          <div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">One-Time Add-ons</h3>
              <p className="text-spindeck-gray">Boost your promotion with these standalone options</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {addonPlans.map((plan) => (
                <div key={plan.priceId} className="relative">
                  <div className="h-full bg-spindeck-dark rounded-lg p-8 border-2 border-transparent hover:border-spindeck-red/50 transition-all duration-300">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                        <p className="text-spindeck-gray text-sm">{plan.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold">${plan.price}</div>
                        <div className="text-spindeck-gray text-sm">one-time</div>
                      </div>
                    </div>

                    {plan.features && (
                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <svg 
                              className="w-5 h-5 text-spindeck-red shrink-0 mt-0.5" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M5 13l4 4L19 7" 
                              />
                            </svg>
                            <span className="text-sm">{feature.name}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <ButtonCheckout 
                      priceId={plan.priceId}
                      mode="payment"
                      text="Purchase Now"
                      className="w-full py-3 rounded font-semibold bg-transparent border border-spindeck-gray hover:bg-spindeck-red hover:border-spindeck-red hover:text-white transition-all duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div className="bg-spindeck-dark rounded-lg p-6">
              <h4 className="font-semibold mb-2">What does "Lifetime Access" mean?</h4>
              <p className="text-spindeck-gray">Pay once and get permanent access to all features included in your plan. No monthly fees, no recurring charges — ever.</p>
            </div>
            <div className="bg-spindeck-dark rounded-lg p-6">
              <h4 className="font-semibold mb-2">Can I upgrade from monthly to lifetime?</h4>
              <p className="text-spindeck-gray">Yes! You can upgrade anytime. Your remaining monthly subscription will be prorated toward your lifetime purchase.</p>
            </div>
            <div className="bg-spindeck-dark rounded-lg p-6">
              <h4 className="font-semibold mb-2">What payment methods do you accept?</h4>
              <p className="text-spindeck-gray">We accept all major credit cards and debit cards through our secure payment processor, Stripe.</p>
            </div>
            <div className="bg-spindeck-dark rounded-lg p-6">
              <h4 className="font-semibold mb-2">Is there a money-back guarantee?</h4>
              <p className="text-spindeck-gray">Yes! All plans come with a 7-day money-back guarantee if you're not satisfied.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpinDeckPricing;
