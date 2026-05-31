package com.saas.workspace.config;

import org.hibernate.context.spi.CurrentTenantIdentifierResolver;
import org.springframework.stereotype.Component;

@Component
public class TenantIdentifierResolver implements CurrentTenantIdentifierResolver<String> {

    @Override
    public String resolveCurrentTenantIdentifier() {
        String tenantId = TenantContext.getTenantId();
        // If someone hits a public endpoint (like login/register) without a tenant ID,
        // we use a default fallback to prevent Hibernate errors.
        return tenantId != null ? tenantId : "PUBLIC";
    }

    @Override
    public boolean validateExistingCurrentSessions() {
        return true;
    }
}