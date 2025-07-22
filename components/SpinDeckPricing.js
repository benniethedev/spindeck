import config from "@/config";
import ButtonCheckout from "./ButtonCheckout";

const SpinDeckPricing = () => {
  // Separate recurring and one-time plans
  const recurringPlans = config.stripe.plans.filter(plan => !plan.isOneTime);
  const oneTimePlans = config.stripe.plans.filter(plan => plan.isOneTime);

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

        {/* Recurring Plans */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-center mb-12">Monthly Subscriptions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recurringPlans.map((plan) => (
              <div 
                key={plan.priceId} 
                className={`relative ${plan.isFeatured ? 'lg:scale-105' : ''}`}
              >
                {plan.isFeatured && (
                  <div className="absolute -top-5 left-0 right-0 mx-auto w-fit">
                    <span className="bg-spindeck-red text-white text-xs font-bold px-4 py-2 rounded-full uppercase">
                      Most Popular
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
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-spindeck-gray text-sm">{plan.description}</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-5xl font-bold">
                        ${plan.price}
                      </span>
                      <span className="text-spindeck-gray ml-2">/month</span>
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
                    mode="subscription"
                    text="Subscribe Now"
                    className={`
                      w-full py-3 rounded font-semibold transition-all duration-300
                      ${plan.isFeatured 
                        ? 'bg-spindeck-red hover:bg-red-600 text-white' 
                        : 'bg-transparent border border-spindeck-gray hover:bg-spindeck-red hover:border-spindeck-red hover:text-white'
                      }
                    `}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* One-Time Plans */}
        <div>
          <h3 className="text-2xl font-bold text-center mb-12">One-Time Promotions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {oneTimePlans.map((plan) => (
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

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div className="bg-spindeck-dark rounded-lg p-6">
              <h4 className="font-semibold mb-2">Can I upgrade or downgrade my plan?</h4>
              <p className="text-spindeck-gray">Yes, you can change your plan at any time. Changes take effect on your next billing cycle.</p>
            </div>
            <div className="bg-spindeck-dark rounded-lg p-6">
              <h4 className="font-semibold mb-2">What payment methods do you accept?</h4>
              <p className="text-spindeck-gray">We accept all major credit cards and debit cards through our secure payment processor, Stripe.</p>
            </div>
            <div className="bg-spindeck-dark rounded-lg p-6">
              <h4 className="font-semibold mb-2">Is there a free trial?</h4>
              <p className="text-spindeck-gray">We don't offer free trials, but all plans come with a 7-day money-back guarantee if you're not satisfied.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpinDeckPricing;